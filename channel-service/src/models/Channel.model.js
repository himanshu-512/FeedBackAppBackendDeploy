import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true, // 🔥 search ke liye
    },

    description: {
      type: String,
      default: "",
    },

    createdBy: {
      type: String, // anonUserId
      required: false,
    },

    members: {
      type: [
        {
          userId: {
            type: String,
            required: true,
          },
          username: {
            type: String,
            required: true,
          },
        },
      ], // anonUserIds
      default: [],
    },

    isOfficial: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

channelSchema.index({
  name: "text",
  description: "text",
});

export default mongoose.model("Channel", channelSchema);
