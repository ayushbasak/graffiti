import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    gc: {
      type: Number,
      default: 0,
    },
    hash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
