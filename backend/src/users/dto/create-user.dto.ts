import { IsLowercase, IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsLowercase()
  username: string;

  gc: number;

  @IsNotEmpty()
  hash: string;
}
