import { Injectable, NotFoundException } from "@nestjs/common";
import { PaymentRepository } from "./payment.repository";
import { CreatePaymentDto } from "./payment.dto";
import { TransactionStatus, PaymentStatus } from "@prisma/client";
import { createPaymentSchema } from "./payment.validation";
import { PrismaService } from "../../prisma/prisma.service";
import { sendTelegramMessage } from "../../utils/telegram";

@Injectable()
export class PaymentService {
    constructor(
        private readonly paymentRepository: PaymentRepository,
        private readonly prisma: PrismaService
    ) { }

    async create(data: CreatePaymentDto) {
        const validatedData = createPaymentSchema.parse(data);

        let userId: string | undefined = undefined;

        if (validatedData.orderId) {
            const order = await this.prisma.order.findUnique({
                where: { id: validatedData.orderId }
            });
            if (!order) throw new NotFoundException("Không tìm thấy đơn hàng");
            userId = order.userId || undefined;
        } else if (validatedData.packageId) {
            const pkg = await this.prisma.package.findUnique({
                where: { id: validatedData.packageId }
            });
            if (!pkg) throw new NotFoundException("Không tìm thấy đơn giao hàng");
            userId = pkg.userId || undefined;
        } else {
            throw new NotFoundException("Phải cung cấp orderId hoặc packageId");
        }

        const payment = await this.prisma.$transaction(async (tx) => {
            const p = await tx.payment.create({
                data: {
                    orderId: validatedData.orderId || null,
                    packageId: validatedData.packageId || null,
                    amount: validatedData.amount,
                    method: validatedData.method as any,
                    status: TransactionStatus.COMPLETED,
                    userId: userId || undefined,
                },
                include: {
                    order: true,
                    package: true,
                }
            });

            if (validatedData.orderId) {
                await tx.order.update({
                    where: { id: validatedData.orderId },
                    data: { paymentStatus: PaymentStatus.PAID }
                });
            }

            return p;
        });

        const message = `<b>🔔 Thông báo thanh toán mới!</b>\n\n` +
            `💰 <b>Số tiền:</b> ${payment.amount.toLocaleString('vi-VN')} VNĐ\n`;

        sendTelegramMessage(message).catch(err => console.error("Telegram Error:", err));

        return payment;
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

    async totalAmount() {
        const totalAmount = await this.prisma.payment.aggregate({
            _sum: {
                amount: true,
            },
        });
        return totalAmount;
    }
}

