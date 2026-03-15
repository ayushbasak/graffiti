import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

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
}
