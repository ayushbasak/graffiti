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
    last_post: {
      type: Date,
      default: new Date('1970-01-01'),
    },
    invite: {
      type: String,
      default: null,
    },
    access_level: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
