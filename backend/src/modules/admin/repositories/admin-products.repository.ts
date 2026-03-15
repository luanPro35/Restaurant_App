import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import {
  CreateProductDto,
  GetProductsDto,
  UpdateProductDto,
} from "../dtos/admin-products.dto";

@Injectable()
export class AdminProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    const { category, variants, image, ...rest } = data;
    return this.prisma.product.create({
      data: {
        ...rest,
        images: image || "",
        category: {
          connect: { id: category },
        },
        variants: variants
          ? {
              create: variants,
            }
          : undefined,
      },
      include: {
        category: true,
        variants: true,
      },
    });
  }

  async findAll(query: GetProductsDto) {
    const limit = Number(query.limit) || 100;
    const page = Number(query.page) || 1;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }
    if (query.category) {
      where.categoryId = query.category;
    }

    return this.prisma.product.findMany({
      where,
      orderBy: query.sortOrder
        ? { price: query.sortOrder as any }
        : { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        category: true,
        variants: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
      },
    });
  }

  async update(id: string, data: UpdateProductDto) {
    const { category, variants, image, ...rest } = data;
    return this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        images: image,
        categoryId: category,
      },
      include: {
        category: true,
        variants: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async updateAvailability(id: string, isAvailable: boolean) {
    return this.prisma.product.update({
      where: { id },
      data: { isAvailable },
    });
  }

  async count(query: GetProductsDto) {
    const { search, category } = query;
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (category) {
      where.categoryId = category;
    }
    return this.prisma.product.count({ where });
  }
}
