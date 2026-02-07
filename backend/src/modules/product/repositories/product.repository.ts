import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { GetProductsDto } from "../dto/get-products.dto";
import { CreateProductDto } from "../dto/create-product.dto";
import { UpdateProductDto } from "../dto/update-product.dto";
import { SortOrder } from "../constants/product.constant";

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(query: GetProductsDto): any {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      unit,
      isAvailable,
      isBestSeller,
    } = query;

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

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (unit) {
      where.unit = unit;
    }

    if (isAvailable !== undefined) {
      where.isAvailable = isAvailable;
    }

    if (isBestSeller !== undefined) {
      where.isBestSeller = isBestSeller;
    }

    return where;
  }

  async findAll(query: GetProductsDto) {
    const { sortOrder, page = 1, limit = 10 } = query;
    const where = this.buildWhere(query);
    const skip = (page - 1) * limit;

    return this.prisma.product.findMany({
      where,
      orderBy: sortOrder ? { price: sortOrder as any } : undefined,
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

  async count(query: GetProductsDto) {
    const where = this.buildWhere(query);
    return this.prisma.product.count({ where });
  }

  async updateAvailability(id: string, isAvailable: boolean) {
    return this.prisma.product.update({
      where: { id },
      data: { isAvailable },
    });
  }
}
