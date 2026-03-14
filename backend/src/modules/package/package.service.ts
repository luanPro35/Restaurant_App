import { Injectable, NotFoundException } from "@nestjs/common";
import { PackageRepository } from "./package.repository";
import { CreatePackageDto, UpdatePackageDto } from "./package.dto";
import { createPackageSchema, updatePackageSchema } from "./package.validation";
import { PaymentService } from "../payment/payment.service";

@Injectable()
export class PackageService {
    constructor(
        private readonly packageRepository: PackageRepository,
        private readonly paymentService: PaymentService
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
                status: "COMPLETED"
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
        return this.packageRepository.update(id, validatedData as UpdatePackageDto);
    }

    async delete(id: string) {
        await this.findOne(id);
        return this.packageRepository.delete(id);
    }

    async count(userId: string) {
        return this.packageRepository.count(userId);
    }
}
