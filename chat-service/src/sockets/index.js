import chatSocket from "./sockets.js";

export const initChatSocket = (io) => {
  chatSocket(io);
};
