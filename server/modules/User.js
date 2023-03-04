import mongoose from "mongoose";

const userShcema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarURL: String,
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("User", userShcema);
