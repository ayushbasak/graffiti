import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageQueueController } from './imagequeue.controller';
import { ImageQueueSchema } from './imagequeue.schema';
import { ImageQueueService } from './imagequeue.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'imagequeue', schema: ImageQueueSchema },
    ]),
  ],
  controllers: [ImageQueueController],
  providers: [ImageQueueService],
})
export class ImageQueueModule {}
