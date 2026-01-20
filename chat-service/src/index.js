import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import chatSocket from "./sockets/sockets.js";
import messageRoutes from "./routes/message.routes.js";

const app = express();
const server = http.createServer(app);

// 🔌 DB
connectDB();

// 🧩 Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
  })
);
app.use(express.json());
app.use(morgan("dev"));

// ❤️ Health check
app.get("/health", (req, res) => {
  res.json({ status: "Chat Service running" });
});

// 📩 REST APIs
app.use("/messages", messageRoutes);

// 🔥 SOCKET SERVER
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
  },
});

/**
 * 🔐 SOCKET AUTH (Gateway + Mobile compatible)
 * - Mobile → auth.userId
 * - Gateway → x-user-id header
 */
io.use((socket, next) => {
  const userId =
    socket.handshake.auth?.userId ||
    socket.handshake.headers["x-user-id"];

  if (!userId) {
    console.log("⚠️ Socket connected without userId");
    return next(); // soft allow (no crash)
  }

  socket.userId = userId;
  next();
});

// 🔌 Attach socket logic
chatSocket(io);

// 🧹 Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Shutting down chat service...");
  server.close(() => process.exit(0));
});

const PORT = process.env.PORT || 4003;
server.listen(PORT, () => {
  console.log(`💬 Chat Service running on port ${PORT}`);
});
