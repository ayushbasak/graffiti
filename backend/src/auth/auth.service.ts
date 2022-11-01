import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthUserDTO } from 'src/auth/dto/auth-user.dto';
import { CreateUserDTO } from 'src/users/dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthUserDTO) {
    const userDTO: CreateUserDTO = new CreateUserDTO();
    userDTO.username = dto.username;
    const salt_rounds = 10;
    const hash = await bcrypt.hash(dto.password, salt_rounds);
    userDTO.hash = hash;
    try {
      await this.userService.create(userDTO);
      const token = await this.generate_token(dto.username);
      return token;
    } catch (err) {
      throw err;
    }
  }

  async login(dto: AuthUserDTO) {
    try {
      const hash = await this.userService.getUserHash(dto.username);
      const match = await bcrypt.compare(dto.password, hash);
      if (match) {
        const token = await this.generate_token(dto.username);
        return token;
      }
    } catch (err) {
      throw err;
    }
  }

  async generate_token(username: string): Promise<{ access_token: string }> {
    const token = await this.jwt.signAsync(
      { username },
      {
        expiresIn: '15m',
        secret: this.config.get('JWT_SECRET'),
      },
    );

    return { access_token: token };
  }
}
