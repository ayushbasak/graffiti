import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.interface';
import { Model, ObjectId } from 'mongoose';
import { CreateUserDTO, UpdateUserDTO } from './dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private user: Model<User>) {}

  // create user in the database
  async create(dto: CreateUserDTO): Promise<User> {
    const created_user = new this.user(dto);
    try {
      await created_user.save();
      return created_user;
    } catch (err) {
      if (err.code === 11000) throw new ForbiddenException('Credentials Taken');
      throw err;
    }
  }

  // get user from string username or user id (Object Id)
  async getUser(username: string): Promise<User> {
    try {
      const user = await this.user.findOne({ username: username });
      return user;
    } catch (err) {
      return err;
    }
  }

  async getUserById(id: ObjectId): Promise<User> {
    try {
      const user = await this.user.findById(id);
      return user;
    } catch (err) {
      return err;
    }
  }

  // async getUserHash(username: string | ObjectId): Promise<string> {
  //   try {
  //     const user = await this.getUser(username);
  //     if (!user) throw new ForbiddenException('User not found');
  //     return user.hash;
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  async updateRefreshToken(dto: UpdateUserDTO) {
    try {
      await this.user
        .findByIdAndUpdate(
          dto.id,
          { refresh_token: dto.refresh_token },
          { new: true },
        )
        .exec();
    } catch (err) {
      throw err;
    }
  }

  async postAndUpdateGC(userId: ObjectId, cost: number) {
    try {
      const user = await this.user.findById(userId);
      if (user.gc < cost) return false;
      else {
        user.gc -= cost;
        await user.save();
        return true;
      }
    } catch (err) {
      throw err;
    }
  }

  async rate_limit(userId: ObjectId) {
    try {
      const user = await this.user.findById(userId);
      // const delay = 5 * 60 * 1000; // 5 minutes in milliseconds
      const delay = 10 * 1000; // 10 seconds in milliseconds
      const time_diff = user.last_post.getTime() + delay - Date.now();
      if (time_diff > 0) return time_diff;
      else {
        user.last_post = new Date();
        await user.save();
        return 0;
      }
    } catch (err) {
      throw err;
    }
  }

  async report_user(userId: ObjectId) {
    try {
      const user = await this.user.findById(userId);
      user.gc -= 10;
      await user.save();
    } catch (err) {
      throw err;
    }
  }

  async restrict_user(userId: ObjectId) {
    try {
      const user = await this.user.findById(userId);
      user.access_level = -1;
      await user.save();
    } catch (err) {
      throw err;
    }
  }
}
