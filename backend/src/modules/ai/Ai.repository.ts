import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AiRepository {
    constructor(private prisma: PrismaService) { }

    async getAllProductNames() {
        const products = await this.prisma.product.findMany({
            select: { name: true }
        });
        return products.map(p => p.name);
    }

    async getProductByName(name: string) {
        return this.prisma.product.findFirst({
            where: { name }
        });
    }

    async getProductsByNames(names: string[]) {
        return this.prisma.product.findMany({
            where: {
                name: { in: names },
                isAvailable: true
            }
        });
    }

    async getCategoriesWithProducts(categorySearch: string) {
        return this.prisma.category.findMany({
            where: {
                OR: [
                    { name: { contains: categorySearch } },
                    { description: { contains: categorySearch } }
                ]
            },
            include: {
                products: {
                    where: { isAvailable: true },
                    take: 5
                }
            }
        });
    }

    async searchProducts(query: string, limit: number = 3) {
        return this.prisma.product.findMany({
            where: {
                name: { contains: query },
                isAvailable: true
            },
            take: limit
        });
    }

    async logInteraction(data: {
        userId: string | null;
        query: string;
        response: string;
        type: string;
        products: any;
    }) {
        return this.prisma.aiInteraction.create({
            data
        });
    }

    async getChatHistory(userId: string) {
        return this.prisma.aiInteraction.findMany({
            where: { userId },
            orderBy: { createdAt: "asc" }
        });
    }
}
