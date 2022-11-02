import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { contains } from 'class-validator';
import { Model, ObjectId } from 'mongoose';
import { GetUser } from 'src/auth/decorator';
import { Display } from './display.interface';

@Injectable()
export class DisplayService {
  constructor(@InjectModel('display') private display: Model<Display>) {}

  async fetch_latest_image(): Promise<Display> {
    try {
      const result = await this.display.findOne();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async bump_image(userId: ObjectId) {
    try {
      const image = await this.display.findOne();
      const bumped_users = image.bumped_users;
      const new_bumped_users: ObjectId[] = [];
      let found = false;
      bumped_users.map((user) => {
        if (userId.toString() === user.toString()) {
          found = true;
        } else {
          new_bumped_users.push(user);
        }
      });
      if (!found) {
        new_bumped_users.push(userId);
      }
      console.log(new_bumped_users);
      image.bumped_users = new_bumped_users;
      image.bumps = new_bumped_users.length;
      console.log(image);
      image.save();
    } catch (err) {
      throw err;
    }
  }
}
