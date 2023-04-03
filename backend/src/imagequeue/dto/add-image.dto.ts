import { Transform } from 'class-transformer';
import { IsNotEmpty, IsUrl, Length, Matches, Max, Min } from 'class-validator';
import { ObjectId } from 'mongoose';

export class AddImageDTO {
  author: ObjectId;
  author_name: string;

  @IsNotEmpty()
  @IsUrl()
  @Matches('.+\\.(png|jpg|jpeg|gif|webp)$')
  url: string;

  @Length(0, 200)
  content: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  @Max(1440)
  duration?: number;
}
