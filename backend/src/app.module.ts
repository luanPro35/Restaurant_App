import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/modules/auth.module";
import { ProductModule } from "./modules/product/product.module";
import { AdminModule } from "./modules/admin/admin.module";
import { TableModule } from "./modules/table/table.module";
import { OrderModule } from "./modules/order/order.module";
import { ConfigModule } from "@nestjs/config";
import { PaymentModule } from "./modules/payment/payment.model";
import { PackageModule } from "./modules/package/package.module";
import { MilestoneModule } from "./modules/milestone/milestone.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProductModule,
    AdminModule,
    TableModule,
    OrderModule,
    PaymentModule,
    PackageModule,
    MilestoneModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
