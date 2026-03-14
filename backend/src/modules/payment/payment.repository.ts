import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreatePaymentDto } from "./payment.dto";
import { TransactionStatus } from "@prisma/client";

@Injectable()
export class PaymentRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreatePaymentDto) {
        const createData: any = {
            amount: data.amount,
            method: data.method,
            status: TransactionStatus.COMPLETED,
            userId: data.userId,
        };

        if (data.orderId) createData.orderId = data.orderId;
        if (data.packageId) createData.packageId = data.packageId;

        return this.prisma.payment.create({
            data: createData,
            include: {
                order: true,
                package: true,
                user: { select: { id: true, name: true, phone: true } },
            },
        });
    }

    async findById(id: string) {
        return this.prisma.payment.findUnique({
            where: { id },
            include: {
                order: true,
                user: { select: { id: true, name: true, phone: true } },
            },
        });
    }

    async findByOrderId(orderId: string) {
        return this.prisma.payment.findMany({
            where: { orderId },
            include: {
                order: true,
                user: { select: { id: true, name: true, phone: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    async totalAmount() {
        return this.prisma.payment.aggregate({
            _sum: { amount: true },
        });
    }

    async findAll(query: any) {
        const { status, method, page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (status) where.status = status;
        if (method) where.method = method;

        const [data, total] = await Promise.all([
            this.prisma.payment.findMany({
                where,
                include: {
                    order: { select: { id: true, tableId: true } },
                    package: { select: { id: true, name: true, address: true } },
                    user: { select: { id: true, name: true } },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: Number(limit),
            }),
            this.prisma.payment.count({ where }),
        ]);

        return {
            data,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
        };
    }
}
