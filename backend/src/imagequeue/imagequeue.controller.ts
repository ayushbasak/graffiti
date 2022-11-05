import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { AccessTokenGuard } from 'src/auth/gaurd';
import { User } from 'src/users/user.interface';
import { AddImageDTO } from './dto';
import { ImageQueueService } from './imagequeue.service';

@Controller('iq')
export class ImageQueueController {
  constructor(private iqService: ImageQueueService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  async test_route(@GetUser() user: User) {
    try {
      user.hash = undefined;
      return user;
    } catch (err) {
      throw err;
    }
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  async add_to_image(
    @GetUser('id') userId: any,
    @Body('url') url: string,
    @Body('content') content: string,
    @Body('duration') duration: number,
  ) {
    const dto: AddImageDTO = new AddImageDTO();
    dto.author = userId;
    dto.url = url;
    dto.content = content;
    dto.duration = duration;
    const res = await this.iqService.add_to_queue(dto);
    return res;
  }
}
