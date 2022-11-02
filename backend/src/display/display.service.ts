import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Display } from './display.interface';

@Injectable()
export class DisplayService {
  constructor(@InjectModel('display') private display: Model<Display>) {}

  async fetch_latest_image() {
    try {
      const result = await this.display.find();
      return result;
    } catch (err) {
      throw err;
    }
  }
}
