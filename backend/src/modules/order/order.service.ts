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
import { PaymentService } from "../payment/payment.service";
import { sendTelegramMessage } from "../../utils/telegram";

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly prisma: PrismaService,
    private readonly paymentService: PaymentService,
  ) { }

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
      userId: createOrderDto.userId,
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

  async findAll(query: any) {
    return this.orderRepository.findAll(query);
  }

  async findById(id: string) {
    return this.orderRepository.findById(id);
  }

  async findActiveOrderByTable(tableId: number, userId?: string) {
    return this.orderRepository.findActiveOrderByTable(tableId, userId);
  }

  async updateStatus(id: string, status: string) {
    const updatedOrder = await this.orderRepository.updateStatus(id, status as OrderStatus);

    if (status === OrderStatus.COMPLETED || status === OrderStatus.CANCELLED) {
      if (updatedOrder.tableId) {
        await this.prisma.table.update({
          where: { id: updatedOrder.tableId },
          data: { status: TableStatus.AVAILABLE }
        });
      }
    }

    if (status === OrderStatus.COMPLETED) {
      const existingPayment = await this.prisma.payment.findFirst({
        where: { orderId: id },
        include: { user: true }
      });

      if (!existingPayment) {
        await this.paymentService.create({
          orderId: id,
          amount: updatedOrder.totalAmount,
          method: "CASH" as any,
        });
      }

      const order = await this.prisma.order.findUnique({
        where: { id },
        include: {
          table: true,
          user: true,
          payments: true
        }
      });

      if (order) {
        const payment = order.payments[0];
        let typeInfo = order.table ? `📍 <b>Bàn:</b> ${order.table.name}` : `🆔 <b>Mã đơn:</b> #${order.id.slice(0, 8)}`;

        const message = `<b>✅ ĐƠN HÀNG ĐÃ HOÀN TẤT</b>\n\n` +
          `👤 <b>Khách hàng:</b> ${order.user?.name || 'Ẩn danh'}\n` +
          `💰 <b>Số tiền:</b> <code>${order.totalAmount.toLocaleString('vi-VN')}</code> VNĐ\n` +
          `💳 <b>Phương thức:</b> ${payment?.method || 'N/A'}\n` +
          `👤 <b>Địa chỉ giao:</b> ${order.deliveryAddress || 'Tại nhà hàng'}\n` +
          `${typeInfo}\n` +
          (payment?.receiptUrl ? `🖼 <b>Ảnh minh chứng:</b> <a href="${payment.receiptUrl}">Xem tại đây</a>\n` : '') +
          `⏰ <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`;

        sendTelegramMessage(message).catch(err => console.error("Telegram Error:", err));
      }
    }

    return updatedOrder;
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
    tableId: number | null,
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

  async getOrdersByTableId(tableId: number) {
    return this.orderRepository.findActiveOrderByTable(tableId);
  }
}
