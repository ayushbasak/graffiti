import mongoose from 'mongoose';
export const DisplaySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
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
    bumped_users: {
      type: [mongoose.Types.ObjectId],
    },
  },
  { timestamps: true },
);
