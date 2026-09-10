import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreatePackageDto, UpdatePackageDto } from "./package.dto";
import { PackageStatus } from "@prisma/client";

@Injectable()
export class PackageRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreatePackageDto & { userId?: string }) {
        return (this.prisma as any).package.create({
            data: {
                name: data.name,
                address: data.address,
                description: data.description,
                price: data.price,
                status: (data.status as PackageStatus) || PackageStatus.PENDING,
                paymentMethod: data.paymentMethod,
                userId: data.userId,
            },
        });
    }

    async update(id: string, data: UpdatePackageDto & { userId?: string }) {
        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.address !== undefined) updateData.address = data.address;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.price !== undefined) updateData.price = data.price;
        if (data.status !== undefined) updateData.status = data.status;
        if (data.userId !== undefined) updateData.userId = data.userId;

        return (this.prisma as any).package.update({
            where: { id },
            data: updateData,
        });
    }

    async delete(id: string) {
        return this.prisma.package.delete({
            where: { id },
        });
    }

    async findAll(userId?: string) {
        return (this.prisma as any).package.findMany({
            where: userId ? { userId } : {},
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async findAllPackage() {
        return (this.prisma as any).package.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async findById(id: string) {
        return this.prisma.package.findUnique({
            where: { id },
        });
    }

    async count(userId: string) {
        return (this.prisma as any).package.count({
            where: {
                userId,
                status: {
                    in: ["CONFIRMED", "COOKING", "DELIVERING", "RECEIVED", "COMPLETED"]
                }
            },
        });
    }
}