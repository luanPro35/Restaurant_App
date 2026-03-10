import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { OrderStatus, OrderType, PaymentStatus } from "@prisma/client";

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.order.create({
      data,
      include: { items: true },
    });
  }

  async findById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        user: { select: { id: true, name: true, phone: true } },
        table: { select: { id: true, name: true } },
      },
    });
  }

  async findActiveOrderByTable(tableId: number, userId?: string) {
    return this.prisma.order.findFirst({
      where: {
        tableId,
        userId,
        status: {
          notIn: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
        },
      },
      include: {
        items: true,
        user: { select: { id: true, name: true, phone: true } },
        table: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
  }

  async addItems(orderId: string, items: any[], totalAmount: number) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        totalAmount,
        items: {
          create: items,
        },
      },
      include: { items: true },
    });
  }

  async findAll(query: any) {
    const { status, type, userId, tableId, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (userId) where.userId = userId;
    if (tableId) where.tableId = tableId;

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: true,
          user: { select: { id: true, name: true } },
          table: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async countCompletedByUserId(userId: string) {
    return this.prisma.order.count({
      where: {
        userId,
        status: OrderStatus.COMPLETED,
      },
    });
  }
}
