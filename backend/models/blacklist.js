import mongoose from "mongoose";

const BlacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "7d",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Blacklist", BlacklistSchema);
