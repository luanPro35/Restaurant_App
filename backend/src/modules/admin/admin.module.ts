import { Module } from "@nestjs/common";
import { AdminProductController } from "./controllers/admin-products.controller";
import { AdminProductService } from "./services/admin-products.service";
import { AdminProductRepository } from "./repositories/admin-products.repository";
import { ProductModule } from "../product/product.module";
import { AuthModule } from "../auth/modules/auth.module";

@Module({
  imports: [ProductModule, AuthModule],
  controllers: [AdminProductController],
  providers: [AdminProductService, AdminProductRepository],
  exports: [AdminProductService],
})
export class AdminModule {}
