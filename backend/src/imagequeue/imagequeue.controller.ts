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
      user.refresh_token = undefined;
      return user;
    } catch (err) {
      throw err;
    }
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  async add_to_image(@GetUser('id') userId: any, @Body() dto: AddImageDTO) {
    try {
      dto.author = userId;
      await this.iqService.add_to_queue(dto);
    } catch (err) {
      throw err;
    }
  }
}
