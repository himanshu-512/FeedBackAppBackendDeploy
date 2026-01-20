import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    name: String,
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Channel", channelSchema);
