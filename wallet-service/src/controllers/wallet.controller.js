import Wallet from "../models/wallet.model.js";
import Transaction from "../models/transaction.model.js";

export const getSummary = async (req, res) => {
  const userId = req.user.id;

  let wallet = await Wallet.findOne({ userId });
  if (!wallet) wallet = await Wallet.create({ userId });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayEarning = await Transaction.aggregate([
    {
      $match: {
        userId,
        type: "credit",
        createdAt: { $gte: today },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  res.json({
    balance: wallet.balance,
    today: todayEarning[0]?.total || 0,
    total: wallet.balance,
  });
};

export const getTransactions = async (req, res) => {
  const tx = await Transaction.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(tx);
};

/* 🔥 CREDIT (used by channel-service later) */
export const creditWallet = async (req, res) => {
  const { userId, amount, title, channel } = req.body;

  const wallet = await Wallet.findOneAndUpdate(
    { userId },
    { $inc: { balance: amount } },
    { upsert: true, new: true }
  );

  await Transaction.create({
    userId,
    amount,
    type: "credit",
    title,
    channel,
  });

  res.json({ success: true, balance: wallet.balance });
};
