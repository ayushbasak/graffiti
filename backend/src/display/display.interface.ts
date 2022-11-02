import { ObjectId } from 'mongoose';

export interface Display {
  author: ObjectId;
  bumped_users: ObjectId[];
  url: string;
  bumps: number;
  duration: number;
}
