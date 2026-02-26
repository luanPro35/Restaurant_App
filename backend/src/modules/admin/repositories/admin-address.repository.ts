import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { CreateAddressDto, UpdateAddressDto } from "../dtos/admin-address.dto";

@Injectable()
export class AdminAddressRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateAddressDto) {
    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    return this.prisma.address.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateAddressDto) {
    const address = await this.findOne(id);
    if (!address) return null;

    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId: address.userId, isDefault: true, NOT: { id } },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.address.delete({
      where: { id },
    });
  }
}
