import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

export class UpdateUserDTO {
  @IsNotEmpty()
  id: ObjectId;
  refresh_token: string;
}
