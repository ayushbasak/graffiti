import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { AuthService } from './auth.service';
import { GetRefreshToken, GetUser } from './decorator';
import { AuthUserDTO } from './dto/auth-user.dto';
import { AccessTokenGuard, RefreshTokenGuard } from './gaurd';

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

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(@GetUser('id') userId: ObjectId) {
    try {
      await this.authService.logout(userId);
    } catch (err) {
      throw err;
    }
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refresh(
    @GetUser('id') userId: ObjectId,
    @GetRefreshToken() refresh_token: string,
  ) {
    return await this.authService.refreshTokens(userId, refresh_token);
  }
}
