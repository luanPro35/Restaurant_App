import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import { errorConverter, errorHandler } from "./middlewares/error.middleware";
import config from "./config";

const app = express();

// security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());

// v1 api routes
app.use("/api/v1", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  // next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  res.status(404).send("Not found");
});

// convert error to ApiError, if needed
// app.use(errorConverter);

// handle error
// app.use(errorHandler);

export default app;
