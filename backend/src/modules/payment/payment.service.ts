import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PaymentRepository } from "./payment.repository";
import { CreatePaymentDto } from "./payment.dto";
import { TransactionStatus, PaymentStatus, PaymentMethod } from "@prisma/client";
import { createPaymentSchema } from "./payment.validation";
import { PrismaService } from "../../prisma/prisma.service";
import { sendTelegramMessage } from "../../utils/telegram";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";

@Injectable()
export class PaymentService {
    private readonly reportTimezone = "Asia/Bangkok";
    constructor(
        private readonly paymentRepository: PaymentRepository,
        private readonly prisma: PrismaService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async create(data: CreatePaymentDto) {
        const validatedData = createPaymentSchema.parse(data);

        let userId: string | undefined = undefined;
        let orderData: any = null;
        let packageData: any = null;

        if (validatedData.orderId) {
            orderData = await this.prisma.order.findUnique({
                where: { id: validatedData.orderId },
                include: { table: true, user: true }
            });
            if (!orderData) throw new NotFoundException("Không tìm thấy đơn hàng");
            userId = orderData.userId || undefined;
        } else if (validatedData.packageId) {
            packageData = await this.prisma.package.findUnique({
                where: { id: validatedData.packageId },
                include: { user: true }
            });
            if (!packageData) throw new NotFoundException("Không tìm thấy đơn giao hàng");
            if (packageData.status === "CANCELED") throw new ConflictException("Đơn đã hủy, không thể thanh toán.");
            userId = packageData.userId || undefined;
        } else {
            throw new NotFoundException("Phải cung cấp orderId hoặc packageId");
        }

        const isCash = validatedData.method === 'CASH';
        const payment = await this.prisma.payment.create({
            data: {
                orderId: validatedData.orderId || null,
                packageId: validatedData.packageId || null,
                amount: validatedData.amount,
                method: validatedData.method as any,
                status: isCash && !validatedData.packageId ? TransactionStatus.COMPLETED : TransactionStatus.PENDING,
                userId: userId || undefined,
            }
        });

        // If Cash payment, update order/table status if not already completed
        if (isCash && validatedData.orderId && orderData) {
            try {
                await this.prisma.order.update({
                    where: { id: validatedData.orderId },
                    data: { status: "COMPLETED" as any }
                });
                if (orderData.tableId) {
                    await this.prisma.table.update({
                        where: { id: orderData.tableId },
                        data: { status: "AVAILABLE" as any }
                    });
                }
            } catch (statusErr) {
                console.error("Failed to update order status on cash payment:", statusErr);
            }
        }

        // Send Telegram notification for checkout / payment
        try {
            if (validatedData.orderId && orderData && orderData.status !== 'COMPLETED') {
                const tableInfo = orderData.table ? `📍 <b>Bàn:</b> ${orderData.table.name}` : `🆔 <b>Mã đơn:</b> #${validatedData.orderId.slice(0, 8)}`;
                const statusBadge = isCash ? '💵 THU TIỀN KHI GIAO HÀNG' : '⏳ CHỜ THANH TOÁN';
                const message = `<b>💰 THÔNG BÁO TÍNH TIỀN / THANH TOÁN</b>\n\n` +
                    `📌 <b>Trạng thái:</b> ${statusBadge}\n` +
                    `👤 <b>Khách hàng:</b> ${orderData.user?.name || 'Khách vãng lai'}\n` +
                    `💰 <b>Số tiền:</b> <code>${validatedData.amount.toLocaleString('vi-VN')}</code> VNĐ\n` +
                    `💳 <b>Phương thức:</b> ${validatedData.method}\n` +
                    `${tableInfo}\n` +
                    `⏰ <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`;
                sendTelegramMessage(message).catch(err => console.error("Telegram notification error:", err));
            } else if (validatedData.packageId && packageData) {
                const statusBadge = isCash ? '✅ ĐÃ THANH TOÁN (TIỀN MẶT)' : '⏳ CHỜ THANH TOÁN';
                const message = `<b>📦 THÔNG BÁO TÍNH TIỀN GÓI GIAO HÀNG</b>\n\n` +
                    `📌 <b>Trạng thái:</b> ${statusBadge}\n` +
                    `👤 <b>Khách hàng:</b> ${packageData.user?.name || 'Khách vãng lai'}\n` +
                    `💰 <b>Số tiền:</b> <code>${validatedData.amount.toLocaleString('vi-VN')}</code> VNĐ\n` +
                    `💳 <b>Phương thức:</b> ${validatedData.method}\n` +
                    `📍 <b>Địa chỉ:</b> ${packageData.address || 'N/A'}\n` +
                    (packageData.note ? `📝 <b>Ghi chú:</b> ${packageData.note.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}\n` : '') +
                    `⏰ <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`;
                sendTelegramMessage(message).catch(err => console.error("Telegram notification error:", err));
            }
        } catch (notifErr) {
            console.error("Failed to send telegram payment notification:", notifErr);
        }

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
        const payments = await this.getRecognizedPayments();
        return { _sum: { amount: payments.reduce((sum, payment) => sum + payment.amount, 0) } };
    }

    async totalAmountToday() {
        const { start, end } = this.getBangkokDayRange(this.dateKeyInBangkok(new Date()));
        const payments = await this.getRecognizedPayments({ gte: start, lt: end });
        const amount = payments.reduce((sum, payment) =>
            payment.updatedAt >= start && payment.updatedAt < end ? sum + payment.amount : sum, 0);
        return { _sum: { amount } };
    }

    private dateKeyInBangkok(date: Date): string {
        const parts = new Intl.DateTimeFormat("en-CA", {
            timeZone: this.reportTimezone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).formatToParts(date);
        const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
        return `${values.year}-${values.month}-${values.day}`;
    }

    private addDaysToDateKey(dateKey: string, days: number): string {
        const [year, month, day] = dateKey.split("-").map(Number);
        const shifted = new Date(Date.UTC(year, month - 1, day + days));
        return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, "0")}-${String(shifted.getUTCDate()).padStart(2, "0")}`;
    }

    private getBangkokDayRange(dateKey: string) {
        const start = new Date(`${dateKey}T00:00:00+07:00`);
        return { start, end: new Date(start.getTime() + 24 * 60 * 60 * 1000) };
    }

    private async getRecognizedPayments(updatedAt?: { gte: Date; lt: Date }) {
        const records = await this.prisma.payment.findMany({
            where: {
                status: TransactionStatus.COMPLETED,
                ...(updatedAt ? { updatedAt } : {}),
            },
            include: {
                order: { select: { status: true } },
                package: { select: { status: true } },
            },
            orderBy: { updatedAt: "desc" },
        });

        return records.filter(payment => {
            if (payment.packageId) {
                if (!payment.package || payment.package.status === "CANCELED") return false;
                // Cash-on-delivery is earned only after the restaurant completes the package.
                return payment.method !== "CASH" || payment.package.status === "COMPLETED";
            }
            if (payment.orderId) return payment.order?.status === "COMPLETED";
            return true;
        });
    }

    async getAnalytics(period: string = "7DAYS") {
        const allowedPeriods = ["TODAY", "7DAYS", "30DAYS", "ALL"];
        const selectedPeriod = allowedPeriods.includes(period) ? period : "7DAYS";
        const todayKey = this.dateKeyInBangkok(new Date());
        const todayRange = this.getBangkokDayRange(todayKey);
        const periodDays = selectedPeriod === "TODAY" ? 1 : selectedPeriod === "30DAYS" ? 30 : 7;
        const startKey = selectedPeriod === "ALL" ? null : this.addDaysToDateKey(todayKey, -(periodDays - 1));
        const periodStart = startKey ? this.getBangkokDayRange(startKey).start : null;
        const rangeWhere = periodStart ? { gte: periodStart, lt: todayRange.end } : undefined;

        const [recognizedPayments, placedOrders, packages, completedOrderItems, completedOrders, completedPackages, activeOrders, activePackages, totalOrders, totalPackages] = await Promise.all([
            this.getRecognizedPayments(),
            this.prisma.order.findMany({
                where: { ...(rangeWhere ? { createdAt: rangeWhere } : {}), status: { not: "CANCELLED" } },
                select: { id: true, createdAt: true },
            }),
            this.prisma.package.findMany({
                where: { ...(rangeWhere ? { createdAt: rangeWhere } : {}), status: { not: "CANCELED" } },
                select: { createdAt: true, status: true },
            }),
            this.prisma.order.findMany({
                where: { ...(rangeWhere ? { createdAt: rangeWhere } : {}), status: "COMPLETED" },
                select: { items: { select: { productId: true, name: true, quantity: true, price: true } } },
            }),
            this.prisma.order.count({ where: { status: "COMPLETED", updatedAt: { gte: todayRange.start, lt: todayRange.end } } }),
            this.prisma.package.count({ where: { status: "COMPLETED", updatedAt: { gte: todayRange.start, lt: todayRange.end } } }),
            this.prisma.order.count({ where: { status: { in: ["PENDING", "CONFIRMED", "COOKING", "SERVED"] } } }),
            this.prisma.package.count({ where: { status: { in: ["PENDING", "CONFIRMED", "COOKING", "DELIVERING", "RECEIVED"] } } }),
            this.prisma.order.count(),
            this.prisma.package.count(),
        ]);

        const allRevenue = recognizedPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
        const revenueToday = recognizedPayments.reduce((sum, payment) =>
            payment.updatedAt >= todayRange.start && payment.updatedAt < todayRange.end
                ? sum + Number(payment.amount || 0) : sum, 0);
        const inPeriod = (date: Date) => !periodStart || (date >= periodStart && date < todayRange.end);
        const periodPayments = recognizedPayments.filter(payment => inPeriod(payment.updatedAt));

        const breakdown = {
            vietQr: { total: 0, count: 0, percent: 0 },
            cash: { total: 0, count: 0, percent: 0 },
            bank: { total: 0, count: 0, percent: 0 },
        };
        for (const payment of periodPayments) {
            const category = payment.method === "CASH" ? breakdown.cash
                : payment.method === "BANK_TRANSFER" ? breakdown.vietQr : breakdown.bank;
            category.total += Number(payment.amount || 0);
            category.count++;
        }
        const paymentTotal = breakdown.vietQr.total + breakdown.cash.total + breakdown.bank.total;
        for (const category of Object.values(breakdown)) {
            category.percent = paymentTotal ? Math.round(category.total / paymentTotal * 100) : 0;
        }

        const periods = new Map<string, { dateLabel: string; dayName: string; revenue: number; ordersCount: number; rawDate: string }>();
        const monthly = selectedPeriod === "ALL";
        if (monthly) {
            const monthCounts = new Map<string, number>();
            for (const record of [...recognizedPayments, ...placedOrders, ...packages]) {
                const key = this.dateKeyInBangkok(record.createdAt).slice(0, 7);
                monthCounts.set(key, (monthCounts.get(key) || 0) + 1);
            }
            const currentMonth = todayKey.slice(0, 7);
            const earliestMonth = [...monthCounts.keys()].sort()[0] || currentMonth;
            let key = earliestMonth;
            while (key <= currentMonth) {
                const [year, month] = key.split("-").map(Number);
                const date = new Date(Date.UTC(year, month - 1, 1));
                periods.set(key, { dateLabel: `${String(month).padStart(2, "0")}/${year}`, dayName: "Tháng", revenue: 0, ordersCount: 0, rawDate: key });
                const next = new Date(Date.UTC(year, month, 1));
                key = `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}`;
            }
        } else {
            for (let i = 0; i < periodDays; i++) {
                const key = this.addDaysToDateKey(startKey!, i);
                const [, month, day] = key.split("-");
                const [year, monthNumber, dayNumber] = key.split("-").map(Number);
                const weekday = new Date(Date.UTC(year, monthNumber - 1, dayNumber)).getUTCDay();
                periods.set(key, { dateLabel: `${day}/${month}`, dayName: i === periodDays - 1 ? "Hôm nay" : ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][weekday], revenue: 0, ordersCount: 0, rawDate: key });
            }
        }

        for (const payment of recognizedPayments) {
            if (!inPeriod(payment.updatedAt)) continue;
            const key = this.dateKeyInBangkok(payment.updatedAt);
            const bucketKey = monthly ? key.slice(0, 7) : key;
            const bucket = periods.get(bucketKey);
            if (bucket) bucket.revenue += Number(payment.amount || 0);
        }
        const countPlacedOn = (date: Date) => {
            const key = this.dateKeyInBangkok(date);
            const bucket = periods.get(monthly ? key.slice(0, 7) : key);
            if (bucket) bucket.ordersCount++;
        };
        placedOrders.forEach(order => countPlacedOn(order.createdAt));
        packages.forEach(pkg => countPlacedOn(pkg.createdAt));

        const dishMap = new Map<string, { name: string; salesCount: number; totalRevenue: number; price: number }>();
        completedOrderItems.forEach(order => order.items.forEach(item => {
            const key = item.productId || item.name;
            const salesCount = Number(item.quantity) || 0;
            const price = Number(item.price) || 0;
            const dish = dishMap.get(key) || { name: item.name, salesCount: 0, totalRevenue: 0, price };
            dish.salesCount += salesCount;
            dish.totalRevenue += price * salesCount;
            if (salesCount) dish.price = Math.round(dish.totalRevenue / dish.salesCount);
            dishMap.set(key, dish);
        }));
        const topDishes = [...dishMap.entries()]
            .map(([id, dish]) => ({ id, ...dish, tag: dish.salesCount >= 10 ? "STAR" : dish.price >= 80000 ? "POTENTIAL" : "POPULAR" }))
            .sort((a, b) => b.salesCount - a.salesCount)
            .slice(0, 7);

        const recentPayments = recognizedPayments.slice(0, 10).map(payment => ({
            id: payment.id, orderId: payment.orderId, packageId: payment.packageId,
            amount: Number(payment.amount), method: payment.method, status: payment.status,
            transactionId: payment.transactionId, createdAt: payment.createdAt.toISOString(),
            updatedAt: payment.updatedAt.toISOString(),
        }));

        return {
            summary: {
                totalRevenue: allRevenue,
                revenueToday,
                totalOrders: totalOrders + totalPackages,
                ordersToday: placedOrders.filter(item => item.createdAt >= todayRange.start && item.createdAt < todayRange.end).length + packages.filter(item => item.createdAt >= todayRange.start && item.createdAt < todayRange.end).length,
                completedToday: completedOrders + completedPackages,
                activeOrders: activeOrders + activePackages,
            },
            daily: [...periods.values()],
            paymentBreakdown: { ...breakdown, grandTotal: paymentTotal, totalTransactions: periodPayments.length },
            topDishes,
            recentPayments,
        };
    }

    async totalPackageToday() {
        const { start, end } = this.getBangkokDayRange(this.dateKeyInBangkok(new Date()));
        const payments = await this.getRecognizedPayments({ gte: start, lt: end });
        const amount = payments.reduce((sum, payment) => payment.packageId && payment.updatedAt >= start && payment.updatedAt < end
            ? sum + Number(payment.amount || 0) : sum, 0);
        return { _sum: { amount } };
    }

    async totalOrderToday() {
        const { start, end } = this.getBangkokDayRange(this.dateKeyInBangkok(new Date()));
        const payments = await this.getRecognizedPayments({ gte: start, lt: end });
        const amount = payments.reduce((sum, payment) => payment.orderId && payment.updatedAt >= start && payment.updatedAt < end
            ? sum + Number(payment.amount || 0) : sum, 0);
        return { _sum: { amount } };
    }

    async uploadReceipt(file: Express.Multer.File, orderId?: string, packageId?: string) {
        if (packageId) {
            const pkg = await this.prisma.package.findUnique({ where: { id: packageId } });
            if (!pkg || pkg.status === "CANCELED") throw new ConflictException("Đơn đã hủy hoặc không tồn tại. Vui lòng liên hệ quán để đối soát chuyển khoản.");
        }
        const receiptUrl = await this.cloudinaryService.uploadFile(file);

        // Biên lai giao hàng chỉ là bằng chứng chờ đối soát, không phải hoàn tất giao hàng.
        if (packageId) {
            return this.prisma.$transaction(async tx => {
                const changed = await tx.package.updateMany({
                    where: { id: packageId, status: { not: "CANCELED" } },
                    data: { updatedAt: new Date() },
                });
                if (!changed.count) throw new ConflictException("Đơn đã hủy. Vui lòng liên hệ quán để đối soát chuyển khoản.");
                const pkg = await tx.package.findUniqueOrThrow({ where: { id: packageId } });
                const existing = await tx.payment.findFirst({ where: { packageId } });
                if (existing) return tx.payment.update({ where: { id: existing.id }, data: { receiptUrl } });
                return tx.payment.create({ data: {
                    packageId, amount: pkg.price, userId: pkg.userId,
                    method: PaymentMethod.BANK_TRANSFER, status: TransactionStatus.PENDING, receiptUrl,
                } });
            });
        }

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
            } else if (packageId) {
                const pkg = await this.prisma.package.update({
                    where: { id: packageId },
                    data: { status: "COMPLETED" as any },
                    include: { user: true }
                });

                const message = `<b>✅ GÓI GIAO HÀNG ĐÃ ĐƯỢC THANH TOÁN (VIETQR)</b>\n\n` +
                    `👤 <b>Khách hàng:</b> ${pkg.user?.name || 'Ẩn danh'}\n` +
                    `💰 <b>Số tiền:</b> <code>${pkg.price.toLocaleString('vi-VN')}</code> VNĐ\n` +
                    `💳 <b>Phương thức:</b> BANK_TRANSFER\n` +
                    `📦 <b>Gói:</b> ${pkg.name}\n` +
                    `📍 <b>Địa chỉ:</b> ${pkg.address || 'N/A'}\n` +
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
        } else if (packageId) {
            const pkg = await this.prisma.package.update({
                where: { id: packageId },
                data: { status: "COMPLETED" as any },
                include: { user: true }
            });

            const message = `<b>✅ GÓI GIAO HÀNG ĐÃ ĐƯỢC THANH TOÁN (VIETQR)</b>\n\n` +
                `👤 <b>Khách hàng:</b> ${pkg.user?.name || 'Ẩn danh'}\n` +
                `💰 <b>Số tiền:</b> <code>${pkg.price.toLocaleString('vi-VN')}</code> VNĐ\n` +
                `💳 <b>Phương thức:</b> BANK_TRANSFER\n` +
                `📦 <b>Gói:</b> ${pkg.name}\n` +
                `📍 <b>Địa chỉ:</b> ${pkg.address || 'N/A'}\n` +
                `🖼 <b>Ảnh minh chứng:</b> <a href="${receiptUrl}">Xem tại đây</a>\n` +
                `⏰ <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`;
            sendTelegramMessage(message).catch(err => console.error("Telegram Error:", err));
        }

        return updatedPayment;
    }

    async testTelegram(customMessage?: string) {
        const text = customMessage || `🔔 <b>TEST KẾT NỐI TELEGRAM BOT</b>\n\n` +
            `✅ Bot hoạt động bình thường!\n` +
            `⏰ <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}\n` +
            `🏨 <b>Hệ thống:</b> Nhà Hàng Restaurant O2O`;
        return sendTelegramMessage(text);
    }

    async checkPaymentStatus(packageId?: string, orderId?: string) {
        if (packageId) {
            const pkg = await this.prisma.package.findUnique({
                where: { id: packageId },
                select: { id: true, status: true, price: true }
            });
            const payment = await this.prisma.payment.findFirst({
                where: { packageId, status: TransactionStatus.COMPLETED }
            });
            const isPaid = !!payment;
            return {
                isPaid: !!isPaid,
                status: pkg?.status,
                paymentId: payment?.id
            };
        }

        if (orderId) {
            const ord = await this.prisma.order.findUnique({
                where: { id: orderId },
                select: { id: true, status: true, totalAmount: true }
            });
            const payment = await this.prisma.payment.findFirst({
                where: { orderId, status: TransactionStatus.COMPLETED }
            });
            const isPaid = !!payment || (ord && ord.status === "COMPLETED");
            return {
                isPaid: !!isPaid,
                status: ord?.status,
                paymentId: payment?.id
            };
        }

        return { isPaid: false };
    }


    async handleSepayWebhook(data: any) {
        console.log("=== SEPAY WEBHOOK RECEIVED ===", JSON.stringify(data));

        try {
            if (!data || data.transferType !== "in") {
                return { success: true, message: "Ignored outgoing or empty transaction" };
            }

            const rawContent = (data.content || data.description || "").trim();
            const searchStr = `${data.content || ""} ${data.description || ""} ${data.code || ""}`.toLowerCase();
            const amount = Number(data.transferAmount || 0);

            let matchedPkg: any = null;
            let matchedOrder: any = null;

            // Ưu tiên mã đơn đã hủy trước khi tìm theo số tiền, tránh ghép nhầm đơn khác.
            const canceledPackages = await this.prisma.package.findMany({ where: { status: "CANCELED" } });
            const canceledMatch = canceledPackages.find(pkg =>
                searchStr.includes(pkg.id.toLowerCase()) || searchStr.includes(pkg.id.slice(0, 8).toLowerCase()));
            if (canceledMatch) {
                await this.prisma.$transaction(async tx => {
                    await tx.package.update({ where: { id: canceledMatch.id }, data: { refundPending: true } });
                    const existing = await tx.payment.findFirst({ where: { packageId: canceledMatch.id } });
                    const paymentData = { amount, method: PaymentMethod.BANK_TRANSFER,
                        status: TransactionStatus.COMPLETED, transactionId: String(data.referenceCode || data.id || "") };
                    if (existing) await tx.payment.update({ where: { id: existing.id }, data: paymentData });
                    else await tx.payment.create({ data: { ...paymentData, packageId: canceledMatch.id, userId: canceledMatch.userId } });
                });
                sendTelegramMessage(`⚠️ Nhận tiền cho đơn đã hủy #${canceledMatch.id.slice(0, 8).toUpperCase()}. Cần đối soát và hoàn tiền.`)
                    .catch(err => console.error("Telegram error:", err));
                return { success: true, message: "Canceled package payment requires refund review" };
            }

            // 1. Tìm đơn giao hàng (Package) có ID khớp với nội dung chuyển khoản
            const pendingPackages = await this.prisma.package.findMany({
                where: {
                    status: { in: ["PENDING", "CONFIRMED", "COOKING", "DELIVERING"] }
                },
                include: { user: true }
            });

            for (const pkg of pendingPackages) {
                const shortId = pkg.id.slice(0, 8).toLowerCase();
                if (searchStr.includes(shortId) || searchStr.includes(pkg.id.toLowerCase())) {
                    matchedPkg = pkg;
                    break;
                }
            }

            // Fallback: nếu chưa khớp theo chuỗi, tìm package PENDING có số tiền khớp duy nhất
            if (!matchedPkg) {
                const pendingPriceMatches = pendingPackages.filter(p => p.status === "PENDING" && Number(p.price) === amount);
                if (pendingPriceMatches.length === 1) {
                    matchedPkg = pendingPriceMatches[0];
                    console.log(`Matched package ${matchedPkg.id} by exact unique amount ${amount}`);
                }
            }

            // 2. Nếu không có gói giao hàng, tìm đơn gọi món tại bàn (Order)
            if (!matchedPkg) {
                const pendingOrders = await this.prisma.order.findMany({
                    where: {
                        status: { in: ["PENDING", "CONFIRMED"] }
                    },
                    include: { table: true, user: true }
                });

                for (const ord of pendingOrders) {
                    const shortId = ord.id.slice(0, 8).toLowerCase();
                    const tableName = ord.table?.name?.toLowerCase();
                    if (
                        searchStr.includes(shortId) ||
                        searchStr.includes(ord.id.toLowerCase()) ||
                        (tableName && searchStr.includes(tableName))
                    ) {
                        matchedOrder = ord;
                        break;
                    }
                }

                // Fallback: nếu chưa khớp theo chuỗi, tìm order PENDING có số tiền khớp duy nhất
                if (!matchedOrder) {
                    const pendingPriceMatches = pendingOrders.filter(o => o.status === "PENDING" && Number(o.totalAmount) === amount);
                    if (pendingPriceMatches.length === 1) {
                        matchedOrder = pendingPriceMatches[0];
                        console.log(`Matched order ${matchedOrder.id} by exact unique amount ${amount}`);
                    }
                }
            }

            const transactionId = String(data.referenceCode || data.id || "");

            // 3. Xử lý khi khớp gói giao hàng
            if (matchedPkg) {
                const existingPayment = await this.prisma.payment.findFirst({
                    where: { packageId: matchedPkg.id }
                });

                if (existingPayment) {
                    await this.prisma.payment.update({
                        where: { id: existingPayment.id },
                        data: {
                            amount: amount || matchedPkg.price,
                            method: PaymentMethod.BANK_TRANSFER,
                            status: TransactionStatus.COMPLETED,
                            transactionId,
                        }
                    });
                } else {
                    await this.prisma.payment.create({
                        data: {
                            packageId: matchedPkg.id,
                            amount: amount || matchedPkg.price,
                            method: PaymentMethod.BANK_TRANSFER,
                            status: TransactionStatus.COMPLETED,
                            userId: matchedPkg.userId || undefined,
                            transactionId,
                        }
                    });
                }

                // Không để webhook mở lại đơn vừa hủy hoặc thay đổi trạng thái chế biến.
                await this.prisma.package.updateMany({
                    where: { id: matchedPkg.id, status: "PENDING" },
                    data: { status: "CONFIRMED" },
                });
                // Hủy và webhook có thể đến đồng thời: ghi nhận tiền nhưng giữ nguyên trạng thái hủy.
                await this.prisma.package.updateMany({
                    where: { id: matchedPkg.id, status: "CANCELED" },
                    data: { refundPending: true },
                });

                const msg = `🎉 <b>SEPAY: THANH TOÁN GIAO HÀNG THÀNH CÔNG</b>\n\n` +
                    `📦 <b>Mã đơn:</b> #${matchedPkg.id.slice(0, 8).toUpperCase()}\n` +
                    `👤 <b>Khách hàng:</b> ${matchedPkg.user?.name || matchedPkg.name || "Khách hàng"}\n` +
                    `💰 <b>Số tiền:</b> <code>+${amount.toLocaleString("vi-VN")}</code> VNĐ\n` +
                    `🏦 <b>Ngân hàng:</b> ${data.gateway || "MBBank"} (${data.accountNumber || ""})\n` +
                    `🆔 <b>Mã giao dịch:</b> <code>${transactionId || "N/A"}</code>\n` +
                    `📝 <b>Nội dung:</b> ${rawContent}\n` +
                    `⏰ <b>Thời gian:</b> ${new Date().toLocaleString("vi-VN")}`;
                sendTelegramMessage(msg).catch(err => console.error("Telegram notification error:", err));

                return { success: true, message: `Processed package ${matchedPkg.id}`, packageId: matchedPkg.id };
            }

            // 4. Xử lý khi khớp đơn tại bàn
            if (matchedOrder) {
                const existingPayment = await this.prisma.payment.findFirst({
                    where: { orderId: matchedOrder.id }
                });

                if (existingPayment) {
                    await this.prisma.payment.update({
                        where: { id: existingPayment.id },
                        data: {
                            amount: amount || matchedOrder.totalAmount,
                            method: PaymentMethod.BANK_TRANSFER,
                            status: TransactionStatus.COMPLETED,
                            transactionId,
                        }
                    });
                } else {
                    await this.prisma.payment.create({
                        data: {
                            orderId: matchedOrder.id,
                            amount: amount || matchedOrder.totalAmount,
                            method: PaymentMethod.BANK_TRANSFER,
                            status: TransactionStatus.COMPLETED,
                            userId: matchedOrder.userId || undefined,
                            transactionId,
                        }
                    });
                }

                await this.prisma.order.update({
                    where: { id: matchedOrder.id },
                    data: { status: "COMPLETED" as any }
                });

                if (matchedOrder.tableId) {
                    await this.prisma.table.update({
                        where: { id: matchedOrder.tableId },
                        data: { status: "AVAILABLE" as any }
                    });
                }

                const msg = `🎉 <b>SEPAY: THANH TOÁN TẠI BÀN THÀNH CÔNG</b>\n\n` +
                    `📍 <b>Bàn:</b> ${matchedOrder.table?.name || `#${matchedOrder.id.slice(0, 8)}`}\n` +
                    `👤 <b>Khách hàng:</b> ${matchedOrder.user?.name || "Khách tại bàn"}\n` +
                    `💰 <b>Số tiền:</b> <code>+${amount.toLocaleString("vi-VN")}</code> VNĐ\n` +
                    `🏦 <b>Ngân hàng:</b> ${data.gateway || "MBBank"}\n` +
                    `🆔 <b>Mã giao dịch:</b> <code>${transactionId || "N/A"}</code>\n` +
                    `📝 <b>Nội dung:</b> ${rawContent}\n` +
                    `⏰ <b>Thời gian:</b> ${new Date().toLocaleString("vi-VN")}`;
                sendTelegramMessage(msg).catch(err => console.error("Telegram notification error:", err));

                return { success: true, message: `Processed order ${matchedOrder.id}`, orderId: matchedOrder.id };
            }

            // 5. Nếu không khớp đơn cụ thể nào vẫn ghi nhận và báo Telegram
            const fallbackMsg = `🔔 <b>SEPAY: TIỀN VÀO TÀI KHOẢN (CHƯA KHỚP ĐƠN)</b>\n\n` +
                `💰 <b>Số tiền:</b> <code>+${amount.toLocaleString("vi-VN")}</code> VNĐ\n` +
                `📝 <b>Nội dung CK:</b> ${rawContent}\n` +
                `🏦 <b>Ngân hàng:</b> ${data.gateway || "MBBank"} (${data.accountNumber || ""})\n` +
                `🆔 <b>Mã GD:</b> <code>${transactionId || "N/A"}</code>\n` +
                `⏰ <b>Thời gian:</b> ${new Date().toLocaleString("vi-VN")}`;
            sendTelegramMessage(fallbackMsg).catch(err => console.error("Telegram error:", err));

            return { success: true, message: "Transaction received but no matching order found" };
        } catch (error: any) {
            console.error("=== SEPAY WEBHOOK PROCESSING ERROR ===", error);
            return { success: false, error: error.message };
        }
    }
}
