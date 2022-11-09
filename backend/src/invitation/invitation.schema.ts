import mongoose from 'mongoose';

export const InvitationSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
