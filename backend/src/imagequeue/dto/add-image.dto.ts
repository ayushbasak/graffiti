import { IsNotEmpty, IsNumber, IsUrl, Length, Max, Min } from 'class-validator';
import { ObjectId } from 'mongoose';

export class AddImageDTO {
  @IsNotEmpty()
  author: ObjectId;
  @IsNotEmpty()
  @IsUrl()
  url: string;
  @Length(0, 200)
  content: string;
  @IsNumber()
  @Min(1)
  @Max(1440)
  duration: number;
}
