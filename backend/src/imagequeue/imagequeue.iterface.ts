import { ObjectId } from 'mongoose';

export interface ImageQueue {
  author: ObjectId;
  url: string;
  content: string;
}
