import { Controller, Get } from '@nestjs/common';
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
}
