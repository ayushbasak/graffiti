import { IsNotEmpty } from 'class-validator';

export class LoginUserDTO {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  hash: string;
}
