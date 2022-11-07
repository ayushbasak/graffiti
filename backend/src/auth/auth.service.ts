import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthUserDTO } from 'src/auth/dto/auth-user.dto';
import { CreateUserDTO, UpdateUserDTO } from 'src/users/dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongoose';
import { User } from 'src/users/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(
    dto: AuthUserDTO,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const hash = await bcrypt.hash(dto.password, 10);

    const userDTO: CreateUserDTO = new CreateUserDTO();
    userDTO.username = dto.username;
    userDTO.hash = hash;
    userDTO.refresh_token = null;
    try {
      const user = await this.userService.create(userDTO);
      const tokens = await this.generate_token(dto.username);
      await this.updateRefreshToken(user._id, tokens.refresh_token);
      return tokens;
    } catch (err) {
      throw err;
    }
  }

  async login(
    dto: AuthUserDTO,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const user = await this.userService.getUser(dto.username);
      if (!user) {
        throw new ForbiddenException('No such user');
      }
      const match = await bcrypt.compare(dto.password, user.hash);
      if (match) {
        const tokens = await this.generate_token(dto.username);
        await this.updateRefreshToken(user._id, tokens.refresh_token);
        return tokens;
      }
    } catch (err) {
      throw err;
    }
  }

  async logout(userId: ObjectId) {
    // note cannot do null or undefined as bcrypt would not hash otherwise
    await this.updateRefreshToken(userId, '');
  }

  async updateRefreshToken(userId: ObjectId, refresh_token: string) {
    const hashed_refresh_token = await bcrypt.hash(refresh_token, 10);
    const dto: UpdateUserDTO = new UpdateUserDTO();
    dto.id = userId;
    dto.refresh_token = hashed_refresh_token;
    this.userService.updateRefreshToken(dto);
  }

  async generate_token(
    username: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const user = await this.userService.getUser(username);
      const access_token = await this.jwt.signAsync(
        { username, id: user._id },
        {
          expiresIn: '120m',
          secret: this.config.get('JWT_SECRET'),
        },
      );

      const refresh_token = await this.jwt.signAsync(
        {
          username,
          id: user._id,
        },
        {
          secret: this.config.get('REFRESH_SECRET'),
          expiresIn: '7d',
        },
      );
      return { access_token, refresh_token };
    } catch (err) {
      throw err;
    }
  }

  async refreshTokens(
    userId: ObjectId,
    refresh_token: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const user: User = await this.userService.getUser(userId);
      if (!user || !user.refresh_token) {
        throw new ForbiddenException('Credentials Invalid');
      }

      const compare = await bcrypt.compare(refresh_token, user.refresh_token);
      if (compare) {
        const tokens = await this.generate_token(user.username);
        await this.updateRefreshToken(user._id, tokens.refresh_token);
        return tokens;
      } else {
        throw new ForbiddenException('Credentials Invalid');
      }
    } catch (err) {
      throw err;
    }
  }
}
