import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { GetUser } from 'src/auth/decorator';
import { JwtGaurd } from 'src/auth/gaurd';
import { User } from 'src/users/user.interface';
import { AddImageDTO } from './dto';
import { ImageQueueService } from './imagequeue.service';

@Controller('iq')
export class ImageQueueController {
  constructor(private iqService: ImageQueueService) {}

  @UseGuards(JwtGaurd)
  @Get()
  defineQueue(@GetUser() user: User) {
    return user;
  }

  @UseGuards(JwtGaurd)
  @Post()
  async add_to_image(
    @GetUser('id') userId: any,
    @Body('url') url: string,
    @Body('content') content: string,
  ) {
    const dto: AddImageDTO = new AddImageDTO();
    dto.author = userId;
    dto.url = url;
    dto.content = content;
    const res = await this.iqService.add_to_queue(dto);
    return res;
  }
}
