import "reflect-metadata";
import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import express from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Tăng giới hạn Payload size cho phép tải ảnh Base64 lớn (50MB)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Enable CORS
  app.enableCors();

  // Global prefix
  app.setGlobalPrefix("api/v1");

  // Trust Proxy for Render / Cloud deployment
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set("trust proxy", 1);

  // Rate Limiting
  const rateLimit = require("express-rate-limit");
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10000,
      message: "Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút.",
    }),
  );

  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle("Restaurant Booking API")
    .setDescription("The API documentation for Restaurant Booking App")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  // Start
  const port = process.env.PORT || 4000;
  await app.listen(port, "0.0.0.0");
  console.log(`Application is running on: http://localhost:${port}/api/v1`);
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
