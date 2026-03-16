import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
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
import { ChatModule } from "./modules/chat/chat.module";
import { VietQrModule } from "./modules/vietQr/vietQr.module";
import { AI_Module } from "./modules/ai/Ai.module";
import { CategoryModule } from "./modules/category/category.module";
import { RedisModule } from "./modules/redis/redis.module";
import authLimiter from "./middlewares/rate-limit.middleware";

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
    ChatModule,
    VietQrModule,
    AI_Module,
    CategoryModule,
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(authLimiter)
      .forRoutes("auth");
  }
}
