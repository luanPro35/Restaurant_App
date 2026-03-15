import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import {
  GetUsersDto,
  CreateUserDto,
  UpdateUserDto,
  DeleteUserDto,
} from "../dtos/admin-manage_user.dto";

@Injectable()
export class AdminManageUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhereClause(query: GetUsersDto) {
    const { name, email, role } = query;
    const where: any = {};

    if (name) {
      where.name = { contains: name };
    }
    if (email) {
      where.email = { contains: email };
    }
    if (query.phone) {
      where.phone = { contains: query.phone };
    }
    if (role) {
      where.role = role;
    }

    return where;
  }

  async findAll(query: GetUsersDto) {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const skip = (page - 1) * limit;
    const where = this.buildWhereClause(query);

    return this.prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: CreateUserDto) {
    return this.prisma.user.create({
      data: data as any,
    });
  }

  async update(data: UpdateUserDto) {
    const { id, ...rest } = data;
    return this.prisma.user.update({
      where: { id },
      data: rest as any,
    });
  }

  async delete(data: DeleteUserDto) {
    return this.prisma.user.delete({
      where: { id: data.id },
    });
  }

  async count(query: GetUsersDto) {
    const where = this.buildWhereClause(query);
    return this.prisma.user.count({ where });
  }
}
