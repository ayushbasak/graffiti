import { ObjectId } from 'mongoose';

export interface User {
  _id: ObjectId;
  username: string;
  hash: string;
  gc: number;
  refresh_token: string;
  last_post: Date;
  invite: string;
  access_level: number;
}
