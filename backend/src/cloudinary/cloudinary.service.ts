import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

@Injectable()
export class CloudinaryService implements OnModuleInit {
  constructor(private configService: ConfigService) { }

  onModuleInit() {
    cloudinary.config({
      cloud_name: this.configService.get<string>("CLOUDINARY_CLOUD_NAME"),
      api_key: this.configService.get<string>("CLOUDINARY_API_KEY"),
      api_secret: this.configService.get<string>("CLOUDINARY_API_SECRET"),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "restaurant-booking",
          cloud_name: this.configService.get<string>("CLOUDINARY_CLOUD_NAME"),
          api_key: this.configService.get<string>("CLOUDINARY_API_KEY"),
          api_secret: this.configService.get<string>("CLOUDINARY_API_SECRET"),
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result?.secure_url || "");
          }
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
