import { Injectable, NotFoundException } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PaymentRepository } from "./payment.repository";
import { CreatePaymentDto } from "./payment.dto";
import { TransactionStatus, PaymentStatus } from "@prisma/client";
import { createPaymentSchema } from "./payment.validation";
import { PrismaService } from "../../prisma/prisma.service";
import { sendTelegramMessage } from "../../utils/telegram";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";

@Injectable()
export class PaymentService {
    constructor(
        private readonly paymentRepository: PaymentRepository,
        private readonly prisma: PrismaService,
        private readonly cloudinaryService: CloudinaryService
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

        const payment = await this.prisma.payment.create({
            data: {
                orderId: validatedData.orderId || null,
                packageId: validatedData.packageId || null,
                amount: validatedData.amount,
                method: validatedData.method as any,
                status: validatedData.method === 'CASH' ? TransactionStatus.COMPLETED : TransactionStatus.PENDING,
                userId: userId || undefined,
            }
        });

        return payment;
    }

    @Cron('30 10 * * *')
    async handleDailyReport() {
        const amountTodayData = await this.totalAmountToday();
        const orderTodayData = await this.totalOrderToday();
        const pkgTodayData = await this.totalPackageToday();

        const amountToday = Number((amountTodayData as any)._sum?.amount || 0);
        const orderToday = Number((orderTodayData as any)._sum?.amount || 0);
        const pkgToday = Number((pkgTodayData as any)._sum?.amount || 0);

        const message = `📊 <b>BÁO CÁO DOANH THU HẰNG NGÀY</b>\n\n` +
            `🛒 <b>Từ Đơn hàng:</b> <code>${orderToday.toLocaleString('vi-VN')}</code> VNĐ\n` +
            `📦 <b>Từ Gói giao dịch:</b> <code>${pkgToday.toLocaleString('vi-VN')}</code> VNĐ\n` +
            `--------------------------------------------\n` +
            `💰 <b>TỔNG DOANH THU:</b> <code>${amountToday.toLocaleString('vi-VN')}</code> VNĐ\n\n` +
            `⏰ <i>Hệ thống tự động tổng kết ngày ${new Date().toLocaleDateString('vi-VN')}</i>`;

        await sendTelegramMessage(message);
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
        return this.prisma.payment.aggregate({
            _sum: { amount: true },
            where: { status: TransactionStatus.COMPLETED }
        });
    }

    async totalAmountToday() {
        return this.prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
                status: TransactionStatus.COMPLETED,
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
        });
    }

    async totalPackageToday() {
        return this.prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
                status: TransactionStatus.COMPLETED,
                packageId: { not: null },
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
        });
    }

    async totalOrderToday() {
        return this.prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
                status: TransactionStatus.COMPLETED,
                orderId: { not: null },
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
        });
    }

    async uploadReceipt(file: Express.Multer.File, orderId?: string, packageId?: string) {
        const receiptUrl = await this.cloudinaryService.uploadFile(file);

        let query: any = {};
        if (orderId) query.orderId = orderId;
        if (packageId) query.packageId = packageId;

        if (!orderId && !packageId) {
            throw new NotFoundException("Phải cung cấp orderId hoặc packageId");
        }

        let payment = await this.prisma.payment.findFirst({
            where: query
        });

        if (!payment) {
            let amount = 0;
            let userId = undefined;
            if (orderId) {
                const order = await this.prisma.order.findUnique({ where: { id: orderId } });
                if (!order) throw new NotFoundException("Không tìm thấy đơn hàng");
                amount = order.totalAmount;
                userId = order.userId || undefined;
            } else if (packageId) {
                const pkg = await this.prisma.package.findUnique({ where: { id: packageId } });
                if (!pkg) throw new NotFoundException("Không tìm thấy gói giao hàng");
                amount = pkg.price;
                userId = pkg.userId || undefined;
            }

            const newPayment = await this.prisma.payment.create({
                data: {
                    orderId: orderId || null,
                    packageId: packageId || null,
                    amount,
                    method: "BANK_TRANSFER" as any,
                    status: TransactionStatus.COMPLETED,
                    userId,
                    receiptUrl,
                }
            });

            if (orderId) {
                const order = await this.prisma.order.update({
                    where: { id: orderId },
                    data: { status: "COMPLETED" as any },
                    include: { table: true, user: true }
                });
                if (order.tableId) {
                    await this.prisma.table.update({
                        where: { id: order.tableId },
                        data: { status: "AVAILABLE" as any }
                    });
                }

                const message = `<b>✅ ĐƠN HÀNG ĐÃ ĐƯỢC THANH TOÁN (VIETQR)</b>\n\n` +
                  `👤 <b>Khách hàng:</b> ${order.user?.name || 'Ẩn danh'}\n` +
                  `💰 <b>Số tiền:</b> <code>${order.totalAmount.toLocaleString('vi-VN')}</code> VNĐ\n` +
                  `💳 <b>Phương thức:</b> BANK_TRANSFER\n` +
                  (order.table ? `📍 <b>Bàn:</b> ${order.table.name}\n` : '') +
                  `🖼 <b>Ảnh minh chứng:</b> <a href="${receiptUrl}">Xem tại đây</a>\n` +
                  `⏰ <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`;
                sendTelegramMessage(message).catch(err => console.error("Telegram Error:", err));
            }

            return newPayment;
        }

        const updatedPayment = await this.prisma.payment.update({
            where: { id: payment.id },
            data: { 
                receiptUrl,
                status: TransactionStatus.COMPLETED
            }
        });

        if (orderId) {
            const order = await this.prisma.order.update({
                where: { id: orderId },
                data: { status: "COMPLETED" as any },
                include: { table: true, user: true }
            });
            if (order.tableId) {
                await this.prisma.table.update({
                    where: { id: order.tableId },
                    data: { status: "AVAILABLE" as any }
                });
            }

            const message = `<b>✅ ĐƠN HÀNG ĐÃ ĐƯỢC THANH TOÁN (VIETQR)</b>\n\n` +
              `👤 <b>Khách hàng:</b> ${order.user?.name || 'Ẩn danh'}\n` +
              `💰 <b>Số tiền:</b> <code>${order.totalAmount.toLocaleString('vi-VN')}</code> VNĐ\n` +
              `💳 <b>Phương thức:</b> BANK_TRANSFER\n` +
              (order.table ? `📍 <b>Bàn:</b> ${order.table.name}\n` : '') +
              `🖼 <b>Ảnh minh chứng:</b> <a href="${receiptUrl}">Xem tại đây</a>\n` +
              `⏰ <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`;
            sendTelegramMessage(message).catch(err => console.error("Telegram Error:", err));
        }

        return updatedPayment;
    }
}
