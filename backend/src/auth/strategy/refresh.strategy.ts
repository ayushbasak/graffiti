import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(config: ConfigService, private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, user_jwt) {
    const user = await this.userService.getUser(user_jwt.username);
    const refresh_token = req
      .get('Authorization')
      .replace('Bearer ', '')
      .trim();
    user.refresh_token = refresh_token;
    return user;
  }
}
