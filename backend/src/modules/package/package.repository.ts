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
        return (this.prisma as any).package.update({
            where: { id },
            data: {
                name: data.name,
                address: data.address,
                description: data.description,
                price: data.price,
                status: data.status as PackageStatus,
                userId: data.userId,
            },
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

    async findById(id: string) {
        return this.prisma.package.findUnique({
            where: { id },
        });
    }

    async count(userId: string) {
        return (this.prisma as any).package.count({
            where: {
                userId,
                status: "CONFIRMED"
            },
        });
    }
}