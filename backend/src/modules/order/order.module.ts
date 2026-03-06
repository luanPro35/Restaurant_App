import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { PrismaService } from "../../prisma/prisma.service";
import { OrderRepository } from "./order.repository";
import { PaymentModule } from "../payment/payment.model";

@Module({
  imports: [PaymentModule],
  providers: [OrderService, PrismaService, OrderRepository],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
