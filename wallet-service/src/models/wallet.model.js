import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // auth service user id
      unique: true,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Wallet", walletSchema);
