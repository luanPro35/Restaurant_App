import io from "socket.io-client";
import { Config } from "../../config";

const SOCKET_URL = Config.API_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

export const connectSocket = (userId: string) => {
  if (!socket.connected) {
    socket.io.opts.query = { userId };
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
