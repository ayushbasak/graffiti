import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DisplayController } from './display.controller';
import { DisplaySchema } from './display.schema';
import { DisplayService } from './display.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'display',
        schema: DisplaySchema,
      },
    ]),
  ],
  controllers: [DisplayController],
  providers: [DisplayService],
})
export class DisplayModule {}
