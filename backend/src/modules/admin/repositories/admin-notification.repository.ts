import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import {
  CreateNotificationDto,
  GetNotificationsDto,
  UpdateNotificationDto,
} from "../dtos/admin-notification.dto";

@Injectable()
export class AdminNotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(query: GetNotificationsDto) {
    const where: any = {};
    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { content: { contains: query.search } },
      ];
    }
    return where;
  }

  async create(data: CreateNotificationDto) {
    const { startAt, endAt, ...rest } = data;
    return this.prisma.notification.create({
      data: {
        ...rest,
        startAt: startAt ? new Date(startAt) : new Date(),
        endAt: endAt ? new Date(endAt) : new Date(),
      },
    });
  }

  async findAll(query: GetNotificationsDto) {
    const { sortOrder, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const where = this.buildWhere(query);

    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: (sortOrder as any) ?? "desc" },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string) {
    return this.prisma.notification.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateNotificationDto) {
    const { id: _id, startAt, endAt, ...rest } = data;
    return this.prisma.notification.update({
      where: { id },
      data: {
        ...rest,
        ...(startAt && { startAt: new Date(startAt) }),
        ...(endAt && { endAt: new Date(endAt) }),
      },
    });
  }

  async delete(id: string) {
    return this.prisma.notification.delete({ where: { id } });
  }
}
