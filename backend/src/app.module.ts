import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/modules/auth.module";
import { ProductModule } from "./modules/product/product.module";
import { AdminModule } from "./modules/admin/admin.module";

@Module({
  imports: [PrismaModule, AuthModule, ProductModule, AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
