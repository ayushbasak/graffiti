import mongoose from 'mongoose';

export const ImageQueueSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    bumps: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);
