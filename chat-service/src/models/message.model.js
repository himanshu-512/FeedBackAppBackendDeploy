import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
      index: true,
    },

    userId: {
      type: String, // anonymous user id
      required: true,
      index: true,
    },

    username: {
      type: String, // snapshot at send time
      required: true,
    },

    text: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    reactions: {
      type: Map,
      of: Number, // { ❤️: 2, 🔥: 1 }
      default: {},
    },
  },
  { timestamps: true }
);

/* 🔥 CHAT INDEX (VERY IMPORTANT) */
messageSchema.index({ channelId: 1, createdAt: 1 });

export default mongoose.model("Message", messageSchema);
