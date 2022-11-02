import mongoose from 'mongoose';

export interface Display {
  imageId: mongoose.Types.ObjectId;
  inserted_at: Date;
  expiration: Date;
}
