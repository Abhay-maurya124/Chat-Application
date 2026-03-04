import mongoose, { Schema } from "mongoose";

const userschema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      default:'00000000'
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userschema);
