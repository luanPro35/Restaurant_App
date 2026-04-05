import { Injectable, NotFoundException } from "@nestjs/common";
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
        const pkg = await this.packageRepository.create(data as CreatePackageDto);

        try {
            let method = "CASH";
            const inputMethod = pkg.paymentMethod?.toUpperCase();

            if (inputMethod === "VIETQR") method = "BANK_TRANSFER";
            else if (inputMethod === "CREDIT_CARD" || inputMethod === "ATM") method = "CREDIT_CARD";
            else if (inputMethod === "MOMO" || inputMethod === "ZALOPAY") method = "E_WALLET";

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

    async findOne(id: string) {
        const pkg = await this.packageRepository.findById(id);
        if (!pkg) {
            throw new NotFoundException(`Package with ID ${id} not found`);
        }
        return pkg;
    }

    async update(id: string, data: UpdatePackageDto) {
        await this.findOne(id);
        const validatedData = updatePackageSchema.parse(data);
        const updatedPkg = await this.packageRepository.update(id, validatedData as UpdatePackageDto);

        if (validatedData.status === PackageStatus.CONFIRMED) {
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

    async count(userId: string) {
        return this.packageRepository.count(userId);
    }
}
