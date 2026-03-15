import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { ImageQueueController } from './imagequeue.controller';
import { ImageQueueSchema } from './imagequeue.schema';
import { ImageQueueService } from './imagequeue.service';
import { S3Service } from './s3.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'imagequeue', schema: ImageQueueSchema },
    ]),
    UsersModule,
    ConfigModule,
  ],
  controllers: [ImageQueueController],
  providers: [ImageQueueService, S3Service],
})
export class ImageQueueModule { }
