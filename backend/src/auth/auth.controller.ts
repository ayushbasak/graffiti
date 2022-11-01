import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDTO } from './dto/auth-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  async signup(@Body() dto: AuthUserDTO) {
    try {
      return await this.authService.signup(dto);
    } catch (err) {
      throw err;
    }
  }

  @Post('login')
  async login(@Body() dto: AuthUserDTO) {
    try {
      return await this.authService.login(dto);
    } catch (err) {
      throw err;
    }
  }
}
