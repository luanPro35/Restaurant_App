import { Server } from "http";
import app from "./app";
// import config from './config';
// import logger from './config/logger';

let server: Server;

const PORT = process.env.PORT || 3000;

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  console.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

server = app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
