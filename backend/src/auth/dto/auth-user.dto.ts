import { IsLowercase, IsNotEmpty, Length } from 'class-validator';

export class AuthUserDTO {
  @IsNotEmpty()
  @IsLowercase()
  @Length(8, 15)
  username: string;

  @IsNotEmpty()
  @Length(8, 15)
  password: string;
}
