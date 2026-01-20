import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    amount: Number,
    type: {
      type: String,
      enum: ["credit", "debit"],
    },
    title: String,
    channel: String,
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
