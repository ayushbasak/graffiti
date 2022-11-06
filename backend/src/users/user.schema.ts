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
      default: 100,
    },
    hash: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);
