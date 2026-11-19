import { Injectable, NotFoundException, ForbiddenException, ConflictException } from "@nestjs/common";
import { PackageRepository } from "./package.repository";
import { CreatePackageDto, UpdatePackageDto } from "./package.dto";
import { createPackageSchema, updatePackageSchema } from "./package.validation";
import { PaymentService } from "../payment/payment.service";
import { sendTelegramMessage } from "../../utils/telegram";
import { PackageStatus } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PackageService {
    constructor(
        private readonly packageRepository: PackageRepository,
        private readonly paymentService: PaymentService,
        private readonly prisma: PrismaService,
    ) { }

    async create(data: CreatePackageDto) {
        const validatedData = createPackageSchema.parse(data);

        let finalUserId: string | undefined = undefined;
        if (validatedData.userId) {
            const userExists = await this.prisma.user.findUnique({
                where: { id: validatedData.userId }
            });
            if (userExists) {
                finalUserId = userExists.id;
            } else {
                console.warn(`[PackageService] User ID '${validatedData.userId}' not found in database. Proceeding without userId.`);
            }
        }

        const pkg = await this.packageRepository.create({
            ...validatedData,
            userId: finalUserId,
        } as CreatePackageDto);

        try {
            let method = "CASH";
            const inputMethod = pkg.paymentMethod?.toUpperCase();

            if (inputMethod === "VIETQR") method = "BANK_TRANSFER";
            await this.paymentService.create({
                packageId: pkg.id,
                amount: pkg.price,
                method: method as any,
                userId: pkg.userId || undefined,
            });
        } catch (error) {
            console.error("Failed to record payment for package:", error);
        }

        return pkg;
    }

    async findAll(userId: string) {
        return this.packageRepository.findAll(userId);
    }

    async findAllPackage() {
        return this.packageRepository.findAllPackage();
    }

    async getAdminSummary() {
        return this.packageRepository.getAdminSummary();
    }

    async findOne(id: string) {
        const pkg = await this.packageRepository.findById(id);
        if (!pkg) {
            throw new NotFoundException(`Package with ID ${id} not found`);
        }
        return pkg;
    }

    async update(id: string, data: UpdatePackageDto) {
        const current = await this.findOne(id);
        if (current.status === "CANCELED" || current.status === "COMPLETED") {
            throw new ConflictException("Đơn đã kết thúc, không thể cập nhật.");
        }
        const validatedData = updatePackageSchema.parse(data);
        const progression = ["PENDING", "CONFIRMED", "COOKING", "DELIVERING", "RECEIVED", "COMPLETED"];
        if (validatedData.status && validatedData.status !== "CANCELED" &&
            progression.indexOf(validatedData.status) < progression.indexOf(current.status)) {
            throw new ConflictException("Không thể chuyển đơn về trạng thái trước đó.");
        }
        const updatedPkg = await this.prisma.$transaction(async tx => {
            const changed = await tx.package.updateMany({
                where: { id, status: current.status },
                data: validatedData as any,
            });
            if (!changed.count) throw new ConflictException("Đơn vừa thay đổi trạng thái. Vui lòng tải lại.");
            if (validatedData.status === "COMPLETED") {
                await tx.payment.updateMany({
                    where: { packageId: id, method: "CASH", status: "PENDING" },
                    data: { status: "COMPLETED" },
                });
            }
            if (validatedData.status === "CANCELED") {
                const payments = await tx.payment.findMany({ where: { packageId: id } });
                await tx.package.update({ where: { id }, data: {
                    refundPending: payments.some(p => (p.method !== "CASH" && p.status === "COMPLETED") || !!p.receiptUrl),
                } });
                await tx.payment.updateMany({ where: { packageId: id, status: "PENDING", receiptUrl: null }, data: { status: "FAILED" } });
            }
            return tx.package.findUniqueOrThrow({ where: { id } });
        });

        if (validatedData.status === PackageStatus.COMPLETED) {
            const payment = await this.prisma.payment.findFirst({
                where: { packageId: id },
                include: { user: true }
            });

            const message = `<b>✅ GÓI GIAO HÀNG ĐÃ HOÀN TẤT</b>\n\n` +
                `👤 <b>Khách hàng:</b> ${payment?.user?.name || 'Ẩn danh'}\n` +
                `💰 <b>Số tiền:</b> <code>${updatedPkg.price.toLocaleString('vi-VN')}</code> VNĐ\n` +
                `💳 <b>Phương thức:</b> ${payment?.method || 'N/A'}\n` +
                `👤 <b>Địa chỉ giao:</b> ${updatedPkg.address || 'N/A'}\n` +
                `📦 <b>Gói:</b> ${updatedPkg.name}\n` +
                (updatedPkg.note ? `📝 <b>Ghi chú:</b> ${updatedPkg.note.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}\n` : '') +
                (payment?.receiptUrl ? `🖼 <b>Ảnh minh chứng:</b> <a href="${payment.receiptUrl}">Xem tại đây</a>\n` : '') +
                `⏰ <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`;

            sendTelegramMessage(message).catch(err => console.error("Telegram Error:", err));
        }

        return updatedPkg;
    }

    async delete(id: string) {
        await this.findOne(id);
        return this.packageRepository.delete(id);
    }

    async cancel(id: string, userId: string) {
        const result = await this.prisma.$transaction(async tx => {
            const pkg = await tx.package.findUnique({ where: { id }, include: { payments: true } });
            if (!pkg) throw new NotFoundException("Không tìm thấy đơn hàng.");
            if (!userId || pkg.userId !== userId) throw new ForbiddenException("Bạn chỉ được hủy đơn của mình.");
            if (pkg.status === "CANCELED") return pkg;
            if (!["PENDING", "CONFIRMED"].includes(pkg.status)) {
                throw new ConflictException("Nhà hàng đã bắt đầu chế biến. Bạn không thể tự hủy đơn này, vui lòng liên hệ quán.");
            }
            // Giữ nguyên giao dịch đã nhận tiền để quán hoàn tiền và đối soát thực tế.
            const changed = await tx.package.updateMany({
                where: { id, userId, status: { in: ["PENDING", "CONFIRMED"] } },
                data: { status: "CANCELED" },
            });
            if (!changed.count) throw new ConflictException("Nhà hàng vừa bắt đầu chế biến. Vui lòng tải lại đơn hàng.");
            const payments = await tx.payment.findMany({ where: { packageId: id } });
            const refundPending = payments.some(p => (p.method !== "CASH" && p.status === "COMPLETED") || !!p.receiptUrl);
            await tx.package.update({ where: { id }, data: { refundPending } });
            await tx.payment.updateMany({
                where: { packageId: id, status: "PENDING", receiptUrl: null },
                data: { status: "FAILED" },
            });
            return tx.package.findUniqueOrThrow({ where: { id } });
        });
        sendTelegramMessage(`❌ Khách đã hủy đơn #${id.slice(0, 8).toUpperCase()}` +
            (result.refundPending ? "\n⚠️ Cần đối soát và hoàn tiền cho khách. Chưa xác nhận hoàn tiền." : ""))
            .catch(err => console.error("Telegram Error:", err));
        return result;
    }

    async count(userId: string, startDate?: Date) {
        return this.packageRepository.count(userId, startDate);
    }
}
