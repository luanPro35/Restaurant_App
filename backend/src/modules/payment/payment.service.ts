import { Injectable, NotFoundException } from "@nestjs/common";
import { PaymentRepository } from "./payment.repository";
import { CreatePaymentDto } from "./payment.dto";
import { TransactionStatus, PaymentStatus } from "@prisma/client";
import { createPaymentSchema } from "./payment.validation";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PaymentService {
    constructor(
        private readonly paymentRepository: PaymentRepository,
        private readonly prisma: PrismaService
    ) { }

    async create(data: CreatePaymentDto) {
        const validatedData = createPaymentSchema.parse(data);

        const order = await this.prisma.order.findUnique({
            where: { id: validatedData.orderId }
        });

        if (!order) {
            throw new NotFoundException("Không tìm thấy đơn hàng để thanh toán");
        }

        return this.prisma.$transaction(async (tx) => {
            const payment = await tx.payment.create({
                data: {
                    orderId: validatedData.orderId,
                    amount: validatedData.amount,
                    method: validatedData.method,
                    status: TransactionStatus.COMPLETED,
                    userId: order.userId,
                },
                include: {
                    order: true,
                }
            });

            await tx.order.update({
                where: { id: validatedData.orderId },
                data: { paymentStatus: PaymentStatus.PAID }
            });

            return payment;
        });
    }

    async findById(id: string) {
        const payment = await this.paymentRepository.findById(id);
        if (!payment) throw new NotFoundException("Không tìm thấy thông tin thanh toán");
        return payment;
    }

    async findByOrderId(orderId: string) {
        return this.paymentRepository.findByOrderId(orderId);
    }

    async findAll(query: any) {
        return this.paymentRepository.findAll(query);
    }
}

