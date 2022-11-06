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
      const updateGC = await this.userService.postAndUpdateGC(dto.author);
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
}
