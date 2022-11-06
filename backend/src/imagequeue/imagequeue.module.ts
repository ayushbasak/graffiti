import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { ImageQueueController } from './imagequeue.controller';
import { ImageQueueSchema } from './imagequeue.schema';
import { ImageQueueService } from './imagequeue.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'imagequeue', schema: ImageQueueSchema },
    ]),
    UsersModule,
  ],
  controllers: [ImageQueueController],
  providers: [ImageQueueService],
})
export class ImageQueueModule {}
