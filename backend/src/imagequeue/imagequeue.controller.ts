import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGaurd } from 'src/auth/gaurd';
import { AddImageDTO } from './dto';
import { ImageQueueService } from './imagequeue.service';

@Controller('iq')
export class ImageQueueController {
  constructor(private iqService: ImageQueueService) {}

  @UseGuards(JwtGaurd)
  @Get()
  defineQueue(@GetUser('username') username: string) {
    return username;
  }

  @UseGuards(JwtGaurd)
  @Post()
  async add_to_image(
    @GetUser('username') username: string,
    @Body('url') url: string,
  ) {
    const dto: AddImageDTO = new AddImageDTO();
    dto.author = username;
    dto.url = url;

    const res = await this.iqService.add_to_queue(dto);
    return res;
  }
}
