import { Injectable, NotFoundException } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
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
                    order: {
                        include: {
                            table: true
                        }
                    },
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

        let typeInfo = "";
        let paymentType = "Đơn hàng";

        if (payment.order) {
            if (payment.order.table) {
                paymentType = "Thanh toán tại bàn 🍽";
                typeInfo = `📍 <b>Bàn:</b> ${payment.order.table.name}\n`;
            } else {
                paymentType = `Đơn hàng ${payment.order.type === 'TAKEAWAY' ? 'Mang về 🛍' : 'Giao hàng 🛵'}`;
                typeInfo = `🆔 <b>Mã đơn:</b> #${payment.order.id.slice(0, 8)}\n`;
            }
        } else if (payment.package) {
            paymentType = "Gói giao hàng 📦";
            typeInfo = `📦 <b>Tên gói:</b> ${payment.package.name}\n`;
        }

        const methodMap: Record<string, string> = {
            'CASH': 'Tiền mặt 💵',
            'BANK_TRANSFER': 'Chuyển khoản 💳',
            'CREDIT_CARD': 'Thẻ tín dụng 💳',
            'E_WALLET': 'Ví điện tử 📱'
        };

        const paymentMethod = methodMap[payment.method] || payment.method;

        const message = `<b>🔔 THÔNG BÁO THANH TOÁN MỚI</b>\n\n` +
            `📝 <b>Loại hình:</b> ${paymentType}\n` +
            `💰 <b>Số tiền:</b> <code>${payment.amount.toLocaleString('vi-VN')}</code> VNĐ\n` +
            `💳 <b>Phương thức:</b> ${paymentMethod}\n` +
            typeInfo +
            `⏰ <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`;

        sendTelegramMessage(message).catch(err => console.error("Telegram Notification Error:", err));

        return payment;
    }

    @Cron('30 10 * * *')
    async handleDailyReport() {
        const amountToday = await this.totalAmountToday();
        const orderToday = await this.totalOrderToday();
        const pkgToday = await this.totalPackageToday();

        const message = `📊 <b>BÁO CÁO TỔNG KẾT NGÀY</b>\n\n` +
            `📦 <b>Tổng đơn hàng:</b> <code>${(orderToday._sum.amount || 0).toLocaleString('vi-VN')}</code> VNĐ\n` +
            `🚚 <b>Gói giao hàng:</b> <code>${(pkgToday._sum.amount || 0).toLocaleString('vi-VN')}</code> VNĐ\n` +
            `--------------------------------------------\n` +
            `💰 <b>Tổng doanh thu:</b> <code>${(amountToday._sum.amount || 0).toLocaleString('vi-VN')}</code> VNĐ\n` +
            `⏰ <i>Hệ thống tự động gửi lúc ${new Date().toLocaleTimeString('vi-VN')}</i>`;

        await sendTelegramMessage(message);
        console.log("Daily Report sent to Telegram successfully!");
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

    async totalAmountToday() {
        const totalAmount = await this.prisma.payment.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
        });
        return totalAmount;
    }

    async totalPackageToday() {
        const totalAmount = await this.prisma.payment.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
                packageId: {
                    not: null,
                },
            },
        });
        return totalAmount;
    }

    async totalOrderToday() {
        const totalAmount = await this.prisma.payment.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
                orderId: {
                    not: null,
                },
            },
        });
        return totalAmount;
    }

}

