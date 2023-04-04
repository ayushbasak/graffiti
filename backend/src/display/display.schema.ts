import mongoose from 'mongoose';
export const DisplaySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    author_name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    content: {
      type: String,
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
    reports: {
      type: [mongoose.Types.ObjectId],
    },
  },
  { timestamps: true },
);
