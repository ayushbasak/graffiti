import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { S3Service } from './s3.service';

@Injectable()
export class ModerationService {
    private grok: OpenAI;

    constructor(
        private config: ConfigService,
        private s3Service: S3Service,
    ) {
        const grokKey = this.config.get<string>('GROK_API_KEY');

        if (!grokKey) {
            console.error(
                '[Moderation] CRITICAL: GROK_API_KEY is missing. ' +
                'Image moderation will always fail closed (block everything). ' +
                'Please set GROK_API_KEY in your environment variables.',
            );
        }

        this.grok = new OpenAI({
            apiKey: grokKey || '',
            baseURL: 'https://api.x.ai/v1',
        });
    }

    async validateImage(imageUrl: string): Promise<boolean> {
        try {
            console.log(`[Moderation] Processing image: ${imageUrl}`);

            // 1. Get image from S3
            const { buffer, contentType } = await this.s3Service.getFileBuffer(imageUrl);

            if (!buffer || buffer.length === 0) {
                console.warn('[Moderation] Empty buffer from S3');
                return false;
            }

            const base64Image = buffer.toString('base64');

            // 2. Use a current Grok vision model (fast non-reasoning variant recommended for speed)
            const response = await this.grok.chat.completions.create({
                model: 'grok-4-1-fast-non-reasoning',   // ← fixed: real model name (vision capable)
                // Alternative options (choose based on needs):
                // 'grok-4-1-fast-reasoning'     → more accurate but slower / more expensive
                // 'grok-4-20-beta-0309-non-reasoning'  → if you want the very latest beta
                // 'grok-2-vision-1212'          → older but still supported & cheap

                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: `You are an extremely strict content moderator for a family-friendly public community art board.

Analyze this image very conservatively and check for ANY of the following violations:

1. Any nudity, exposed genitalia (even partial or implied), sexual arousal, or sexual activity
2. Sexually suggestive poses, clothing, focus on body parts, or erotic framing
3. Extreme violence, gore, blood, mutilation, torture, or depiction of illegal/harmful acts
4. Hate symbols, slurs, targeted harassment symbols, or extremist propaganda

Rule: If there is even the slightest doubt (1% uncertainty), or if the image is borderline/ambiguous → classify as INVALID.
Only output exactly one word:

'VALID'   → 100% clearly safe for all ages, no issues whatsoever
'INVALID' → anything else (block it)

Do not explain. Do not add punctuation. One word only.`,
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:${contentType};base64,${base64Image}`,
                                },
                            },
                        ],
                    },
                ],

                max_tokens: 10,          // very small — we only expect 1 word
                temperature: 0.0,        // deterministic output
            });

            const text = (response.choices?.[0]?.message?.content ?? '').trim().toUpperCase();

            console.log(`[Moderation] Grok result for ${imageUrl}: "${text}"`);

            // Accept only clean "VALID" — be strict about parsing
            return text === 'VALID';
        } catch (error) {
            console.error('[Moderation] Error during Grok moderation:', error);
            // Fail-closed policy: block on any error (API down, rate limit, invalid image, etc.)
            return false;
        }
    }
}