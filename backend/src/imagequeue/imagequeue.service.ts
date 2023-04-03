import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { AddImageDTO } from './dto';
import { ImageQueue } from './imagequeue.iterface';

@Injectable()
export class ImageQueueService {
  constructor(
    @InjectModel('imagequeue') private iq: Model<ImageQueue>,
    private userService: UsersService,
  ) {}

  async add_to_queue(dto: AddImageDTO) {
    try {
      const rate_limited = await this.userService.rate_limit(dto.author);
      if (rate_limited > 0) {
        throw new ForbiddenException(
          `Rate limited | Wait for ${Math.round(rate_limited / 1000)} seconds`,
        );
      }
      const user = await this.userService.getUserById(dto.author);
      if (user.access_level < 0) {
        throw new ForbiddenException('Banned');
      }
      const queue_size = await this.iq.countDocuments();
      const cost = queue_size * 10;
      const updateGC = await this.userService.postAndUpdateGC(dto.author, cost);
      if (updateGC) {
        const image = new this.iq(dto);
        await image.save();
      } else {
        throw new ForbiddenException('Not Enough Graf Coins');
      }
    } catch (err) {
      throw err;
    }
  }

  async get_queue_details() {
    try {
      // const queue = await this.iq.find();
      const queue_size = await this.iq.countDocuments();
      return {
        queue_size,
        gc_req: queue_size * 10,
      };
    } catch (err) {
      throw err;
    }
  }
}
