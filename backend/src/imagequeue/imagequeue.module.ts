import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { ImageQueueController } from './imagequeue.controller';
import { ImageQueueSchema } from './imagequeue.schema';
import { ImageQueueService } from './imagequeue.service';
import { S3Service } from './s3.service';
import { ModerationService } from './moderation.service';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'imagequeue', schema: ImageQueueSchema },
    ]),
    UsersModule,
    ConfigModule,
    PostsModule,
  ],
  controllers: [ImageQueueController],
  providers: [ImageQueueService, S3Service, ModerationService],
})
export class ImageQueueModule { }
