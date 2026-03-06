import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { TableStatus } from "@prisma/client";

@Injectable()
export class AdminTableRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTable(data: {
    name: string;
    capacity: number;
    status?: TableStatus;
    location?: string;
  }) {
    return this.prisma.table.create({ data });
  }

  async updateTable(
    id: string,
    data: {
      name?: string;
      capacity?: number;
      status?: TableStatus;
      location?: string;
    },
  ) {
    return this.prisma.table.update({ where: { id }, data });
  }

  async deleteTable(id: string) {
    return this.prisma.table.delete({ where: { id } });
  }

  async getTables(params: {
    status?: TableStatus;
    location?: string;
    skip?: number;
    take?: number;
  }) {
    const { status, location, skip, take } = params;
    return this.prisma.table.findMany({
      where: { status, location },
      skip,
      take,
    });
  }

  async count(status?: TableStatus, location?: string) {
    return this.prisma.table.count({ where: { status, location } });
  }

  async getTableById(id: string) {
    return this.prisma.table.findUnique({ where: { id } });
  }
}
