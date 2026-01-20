import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./src/config/models/db.js";
import walletRoutes from "./src/routes/wallet.routes.js";

dotenv.config();

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- ROUTES ---------------- */
app.use("/", walletRoutes);

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 3003;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Wallet service running on port ${PORT}`);
  });
});
