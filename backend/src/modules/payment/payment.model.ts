import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { PaymentRepository } from "./payment.repository";
import { PrismaService } from "../../prisma/prisma.service";
import { CloudinaryModule } from "../../cloudinary/cloudinary.module";

@Module({
    imports: [CloudinaryModule],
    controllers: [PaymentController],
    providers: [PaymentService, PaymentRepository, PrismaService],
    exports: [PaymentService],
})
export class PaymentModule { }
