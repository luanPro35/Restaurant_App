import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/modules/auth.module";
import { ProductModule } from "./modules/product/product.module";

@Module({
  imports: [PrismaModule, AuthModule, ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
