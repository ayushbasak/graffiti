import { ObjectId } from 'mongoose';

export interface User {
  _id: ObjectId;
  username: string;
  hash: string;
  gc: number;
}
