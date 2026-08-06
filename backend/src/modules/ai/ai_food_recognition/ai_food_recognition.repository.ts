import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class AiFoodRecognitionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProducts() {
    return this.prisma.product.findMany({
      take: 50,
    });
  }

  async findMatchingProducts(keywords: string[]) {
    if (!keywords || keywords.length === 0) {
      return this.prisma.product.findMany({ take: 5 });
    }
    return this.prisma.product.findMany({
      where: {
        OR: keywords.map((kw) => ({
          name: {
            contains: kw,
          },
        })),
      },
      take: 6,
    });
  }

  async findProductsByIds(ids: string[]) {
    if (!ids || ids.length === 0) return [];
    return this.prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}