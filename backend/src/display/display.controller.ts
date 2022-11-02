import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { GetUser } from 'src/auth/decorator';
import { JwtGaurd } from 'src/auth/gaurd';
import { DisplayService } from './display.service';

@Controller('display')
export class DisplayController {
  constructor(private displayService: DisplayService) {}
  @Get()
  async display() {
    try {
      return await this.displayService.fetch_latest_image();
    } catch (err) {
      throw err;
    }
  }

  @UseGuards(JwtGaurd)
  @Post('bump')
  async bump(@GetUser('id') userId: ObjectId) {
    return await this.displayService.bump_image(userId);
  }
}
