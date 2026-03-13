import { Injectable, NotFoundException } from "@nestjs/common";
import { VietQrRepository } from "./vietQr.repository";
import { PackageService } from "../package/package.service";
import { CreateVietQrDto } from "./dtos/create-vietQr.dto";

@Injectable()
export class VietQrService {
    constructor(
        private readonly vietQrRepository: VietQrRepository,
        private readonly packageService: PackageService
    ) { }

    private generateQrUrl(data: { amount: number, orderInfo: string, accountName: string }) {
        const baseUrl = 'https://img.vietqr.io/image/MB-0905622341-compact2.png';
        const description = encodeURIComponent(data.orderInfo || '');
        const name = encodeURIComponent(data.accountName || '');

        return `${baseUrl}?amount=${data.amount}&addInfo=${description}&accountName=${name}`;
    }

    async createVietQr(data: CreateVietQrDto) {
        const accountName = 'LE QUANG LUAN';
        const bin = '970422';
        const accountNumber = '0905622341';

        const qrData = data.qrData || this.generateQrUrl({
            amount: data.amount,
            orderInfo: data.orderInfo || '',
            accountName
        });

        const body = {
            ...data,
            accountName,
            bin,
            accountNumber,
            qrData,
        };

        return this.vietQrRepository.createVietQr(body);
    }

    async createQrForPackage(packageId: string) {
        const pkg = await this.packageService.findOne(packageId);
        if (!pkg) throw new NotFoundException('Không tìm thấy đơn hàng');

        return this.createVietQr({
            accountName: 'LE QUANG LUAN',
            bin: '970422',
            accountNumber: '0905622341',
            amount: pkg.price,
            orderInfo: `Thanh toan don hang ${pkg.id.substring(0, 8)}`,
            packageId: pkg.id,
        } as any);
    }

    async getVietQrById(id: string) {
        return this.vietQrRepository.getVietQrById(id);
    }

    async getVietQrByOrderId(orderId: string) {
        return this.vietQrRepository.getVietQrByOrderId(orderId);
    }

    async getVietQrByPackageId(packageId: string) {
        return this.vietQrRepository.getVietQrByPackageId(packageId);
    }
}