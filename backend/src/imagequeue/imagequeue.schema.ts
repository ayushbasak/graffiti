import mongoose from 'mongoose';

export const ImageQueueSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);
