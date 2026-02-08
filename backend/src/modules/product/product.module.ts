import { Module } from "@nestjs/common";
import { ProductController } from "./controllers/product.controller";
import { ProductService } from "./services/product.service";
import { ProductRepository } from "./repositories/product.repository";
import { CloudinaryModule } from "../../cloudinary/cloudinary.module";

@Module({
  imports: [CloudinaryModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductService],
})
export class ProductModule {}
