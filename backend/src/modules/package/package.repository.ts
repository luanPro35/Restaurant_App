import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreatePackageDto, UpdatePackageDto } from "./package.dto";
import { PackageStatus } from "@prisma/client";

@Injectable()
export class PackageRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreatePackageDto) {
        return this.prisma.package.create({
            data: {
                name: data.name,
                address: data.address,
                description: data.description,
                price: data.price,
                status: data.status as PackageStatus,
            },
        });
    }

    async update(id: string, data: UpdatePackageDto) {
        return this.prisma.package.update({
            where: { id },
            data: {
                name: data.name,
                address: data.address,
                description: data.description,
                price: data.price,
                status: data.status as PackageStatus,
            },
        });
    }

    async delete(id: string) {
        return this.prisma.package.delete({
            where: { id },
        });
    }

    async findAll() {
        return this.prisma.package.findMany({
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
}