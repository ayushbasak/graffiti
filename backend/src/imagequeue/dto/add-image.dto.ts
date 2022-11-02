import { IsNotEmpty, IsUrl, Length } from 'class-validator';
import { ObjectId } from 'mongoose';

export class AddImageDTO {
  @IsNotEmpty()
  author: ObjectId;
  @IsNotEmpty()
  @IsUrl()
  url: string;
  @Length(0, 200)
  content: string;
}
