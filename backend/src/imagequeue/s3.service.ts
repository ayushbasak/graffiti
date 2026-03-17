import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
    private s3Client: S3Client;

    constructor(private config: ConfigService) {
        this.s3Client = new S3Client({
            region: this.config.get('AWS_REGION'),
            credentials: {
                accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY'),
            },
        });
    }

    async getPresignedUrl(fileName: string, contentType: string) {
        const bucketName = this.config.get('AWS_S3_BUCKET_NAME');
        const key = `${Date.now()}-${fileName}`; // Unique key to prevent overwrites

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            ContentType: contentType,
        });

        // URL expires in 60 seconds
        const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 60 });

        // This is where the image will eventually live
        const publicUrl = `https://${bucketName}.s3.${this.config.get('AWS_REGION')}.amazonaws.com/${key}`;

        return { uploadUrl, publicUrl };
    }

    async getFileBuffer(url: string): Promise<{ buffer: Buffer, contentType: string }> {
        try {
            const bucketName = this.config.get('AWS_S3_BUCKET_NAME');
            const urlParts = url.split('/');
            const key = urlParts[urlParts.length - 1];

            const command = new GetObjectCommand({
                Bucket: bucketName,
                Key: key,
            });

            const response = await this.s3Client.send(command);
            const stream = response.Body as Readable;

            return new Promise((resolve, reject) => {
                const chunks: Uint8Array[] = [];
                stream.on('data', (chunk) => chunks.push(new Uint8Array(chunk)));
                stream.on('error', (err) => reject(err));
                stream.on('end', () => {
                    resolve({
                        buffer: Buffer.concat(chunks),
                        contentType: response.ContentType || 'image/jpeg'
                    });
                });
            });
        } catch (error) {
            console.error('Error fetching file from S3:', error);
            throw error;
        }
    }

    async deleteFile(url: string) {
        try {
            const bucketName = this.config.get('AWS_S3_BUCKET_NAME');
            // Extract key from URL
            // Format: https://bucket.s3.region.amazonaws.com/key
            const urlParts = url.split('/');
            const key = urlParts[urlParts.length - 1];

            const command = new DeleteObjectCommand({
                Bucket: bucketName,
                Key: key,
            });

            await this.s3Client.send(command);
            console.log(`Deleted file from S3: ${key}`);
        } catch (error) {
            console.error('Failed to delete file from S3', error);
        }
    }
}
