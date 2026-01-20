import express from "express";
import {
  getSummary,
  getTransactions,
  creditWallet,
} from "../controllers/wallet.controller.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/summary", protect, getSummary);
router.get("/transactions", protect, getTransactions);

/* internal service call */
router.post("/credit", creditWallet);

export default router;
