import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User } from 'src/users/user.interface';
import { UsersService } from 'src/users/users.service';
import { Display } from './display.interface';

@Injectable()
export class DisplayService {
  constructor(
    @InjectModel('display') private display: Model<Display>,
    @InjectModel('users') private user: Model<User>,
  ) {}

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

      if (!image) {
        throw new ForbiddenException('No image in display');
      }

      if (image.author.toString() === userId.toString()) {
        throw new ForbiddenException('Cannot upvote your own post');
      }

      const author = await this.user.findById(image.author);
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
      image.bumped_users = new_bumped_users;
      image.bumps = new_bumped_users.length;
      const change_in_gc = new_bumped_users.length - bumped_users.length;
      author.gc += change_in_gc * 10;
      await author.save();
      await image.save();
    } catch (err) {
      throw err;
    }
  }
}
