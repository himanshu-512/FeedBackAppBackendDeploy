import axios from "axios";
import Message from "../models/message.model.js";

const CHANNEL_SERVICE_URL = process.env.CHANNEL_SERVICE_URL;

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("joinChannel", ({ channelId }) => {
      socket.join(channelId);
    });

    socket.on("sendMessage", async (data) => {
      console.log("SEND MESSAGE:", data);
      try {
        const { channelId, userId, username, text } = data;

        if (!channelId || !userId || !text) return;

        // 🔥 ASK CHANNEL SERVICE (SOURCE OF TRUTH)
        const res = await axios.get(
          `${CHANNEL_SERVICE_URL}/${channelId}/is-member/${userId}`
        );

        if (!res.data.isMember) {
          socket.emit("errorMessage", {
            message: "You must join this channel to chat",
          });
          return;
        }

        // ✅ SAVE MESSAGE
        const message = await Message.create({
          channelId,
          userId,
          username,
          text,
        });

        io.to(channelId).emit("newMessage", message);
      } catch (err) {
        console.log("SEND MESSAGE ERROR:", err.message);
        socket.emit("errorMessage", {
          message: "Message failed",
        });
      }
    });
  });
};

export default chatSocket;
