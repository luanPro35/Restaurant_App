import dotenv from "dotenv";
import path from "path";
import joi from "joi";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = joi.object().unknown();

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongoose: {
    url:
      process.env.MONGO_URI + (process.env.NODE_ENV === "test" ? "-test" : ""),
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes:
      process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
};
