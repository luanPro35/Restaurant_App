import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  OrderStatus,
  OrderType,
  PaymentStatus,
  TableStatus,
} from "@prisma/client";
import { OrderRepository } from "./order.repository";
import { CreateOrderDto } from "./order.dto";

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { tableId, items, type, notes } = createOrderDto;

    const productIds = items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let totalAmount = 0;
    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      const itemPrice = product.price;
      totalAmount += itemPrice * item.quantity;

      return {
        productId: item.productId,
        name: product.name,
        quantity: item.quantity,
        price: itemPrice,
        note: item.note,
      };
    });

    const order = await this.orderRepository.create({
      userId: null,
      tableId,
      totalAmount,
      type: type || OrderType.DINE_IN,
      notes,
      items: {
        create: orderItems,
      },
    });

    if (tableId && (type === OrderType.DINE_IN || !type)) {
      await this.prisma.table.update({
        where: { id: tableId },
        data: { status: TableStatus.OCCUPIED },
      });
    }

    return order;
  }

  async findById(id: string) {
    return this.orderRepository.findById(id);
  }

  async findActiveOrderByTable(tableId: string) {
    return this.orderRepository.findActiveOrderByTable(tableId);
  }

  async updateStatus(id: string, status: string) {
    return this.orderRepository.updateStatus(id, status as OrderStatus);
  }

  async addItems(orderId: string, items: any[]) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new Error("Order not found");

    const productIds = items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let additionalAmount = 0;
    const newItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      additionalAmount += product.price * item.quantity;

      return {
        productId: item.productId,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        note: item.note,
      };
    });

    return this.orderRepository.addItems(
      orderId,
      newItems,
      order.totalAmount + additionalAmount,
    );
  }

  async createOrder(
    userId: string,
    tableId: string | null,
    items: any[],
    totalAmount: number,
    type: OrderType,
    note?: string,
  ) {
    return this.prisma.order.create({
      data: {
        userId,
        tableId,
        items: {
          create: items,
        },
        totalAmount,
        type,
        note,
      },
      include: { items: true },
    });
  }

  async getOrdersByTableId(tableId: string) {
    return this.orderRepository.findActiveOrderByTable(tableId);
  }
}
