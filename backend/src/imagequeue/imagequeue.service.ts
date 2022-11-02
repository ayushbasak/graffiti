import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddImageDTO } from './dto';
import { ImageQueue } from './imagequeue.iterface';

@Injectable()
export class ImageQueueService {
  constructor(@InjectModel('imagequeue') private iq: Model<ImageQueue>) {}

  async add_to_queue(dto: AddImageDTO) {
    const image = new this.iq(dto);
    try {
      await image.save();
    } catch (err) {
      throw err;
    }
  }
}
