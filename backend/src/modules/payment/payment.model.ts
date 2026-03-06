import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { PaymentRepository } from "./payment.repository";
import { PrismaService } from "../../prisma/prisma.service";

@Module({
    controllers: [PaymentController],
    providers: [PaymentService, PaymentRepository, PrismaService],
    exports: [PaymentService],
})
export class PaymentModule { }
