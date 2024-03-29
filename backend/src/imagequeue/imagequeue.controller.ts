import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { AccessTokenGuard } from 'src/auth/gaurd';
import { User } from 'src/users/user.interface';
import { UsersService } from 'src/users/users.service';
import { AddImageDTO } from './dto';
import { ImageQueueService } from './imagequeue.service';

@Controller('iq')
export class ImageQueueController {
  constructor(
    private iqService: ImageQueueService,
    private userService: UsersService,
  ) {}

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
      const user = await this.userService.getUserById(userId);
      dto.author = userId;
      dto.author_name = user.username;
      await this.iqService.add_to_queue(dto);
    } catch (err) {
      throw err;
    }
  }

  // @UseGuards(AccessTokenGuard)
  @Get('queue')
  async get_queue_details() {
    try {
      const queue = await this.iqService.get_queue_details();
      return queue;
    } catch (err) {
      throw err;
    }
  }
}
