import io from "socket.io-client";
const SOCKET_URL = "http://192.168.1.5:4000";

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
