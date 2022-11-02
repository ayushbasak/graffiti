import { IsNotEmpty, IsUrl } from 'class-validator';

export class AddImageDTO {
  @IsNotEmpty()
  author: string;
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
