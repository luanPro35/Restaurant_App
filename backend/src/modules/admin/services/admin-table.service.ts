import { Injectable } from "@nestjs/common";
import { AdminTableRepository } from "../repositories/admin-table.repository";
import {
  createTableSchema,
  updateTableSchema,
  getTablesSchema,
  getTableByIdSchema,
  deleteTableSchema,
} from "../validations/admin-table.validation";

@Injectable()
export class AdminTableService {
  constructor(private readonly adminTableRepository: AdminTableRepository) {}

  async createTable(data: any) {
    const validatedData = createTableSchema.parse(data);
    return this.adminTableRepository.createTable(validatedData);
  }

  async updateTable(id: number, data: any) {
    const validatedData = updateTableSchema.parse({ ...data, id });
    const { id: _, ...updateData } = validatedData;
    return this.adminTableRepository.updateTable(id, updateData);
  }

  async deleteTable(id: number) {
    deleteTableSchema.parse({ id });
    return this.adminTableRepository.deleteTable(id);
  }

  async getTables(query: any) {
    const validatedQuery = getTablesSchema.parse(query);
    const { status, location } = validatedQuery;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const tables = await this.adminTableRepository.getTables({
      status,
      location,
      skip,
      take: limit,
    });
    const total = await this.adminTableRepository.count(status, location);

    return {
      data: tables,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTableById(id: number) {
    getTableByIdSchema.parse({ id });
    return this.adminTableRepository.getTableById(id);
  }

  async findTableByNumber(tableNumber: string) {
    return this.adminTableRepository.getTableByName(tableNumber);
  }
}
