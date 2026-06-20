import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class VietQrRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createVietQr(data: any) {
        const { accountName, bin, accountNumber, amount, orderInfo, qrData, deeplink, orderId, packageId } = data;
        
        if (orderId) {
            const existing = await this.prisma.vietQr.findUnique({ where: { orderId } });
            if (existing) {
                return this.prisma.vietQr.update({
                    where: { orderId },
                    data: { accountName, bin, accountNumber, amount, orderInfo, qrData, deeplink, packageId }
                });
            }
        } else if (packageId) {
            const existing = await this.prisma.vietQr.findUnique({ where: { packageId } });
            if (existing) {
                return this.prisma.vietQr.update({
                    where: { packageId },
                    data: { accountName, bin, accountNumber, amount, orderInfo, qrData, deeplink, orderId }
                });
            }
        }

        return this.prisma.vietQr.create({
            data: {
                accountName,
                bin,
                accountNumber,
                amount,
                orderInfo,
                qrData,
                deeplink,
                orderId,
                packageId,
            },
        });
    }

    async getVietQrById(id: string) {
        return this.prisma.vietQr.findUnique({ where: { id }, include: { order: true, package: true } });
    }

    async getVietQrByOrderId(orderId: string) {
        return this.prisma.vietQr.findUnique({ where: { orderId }, include: { order: true } });
    }

    async getVietQrByPackageId(packageId: string) {
        return this.prisma.vietQr.findUnique({ where: { packageId }, include: { package: true } });
    }
}