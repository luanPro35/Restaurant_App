import { AdminTableService } from "../services/admin-table.service";
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { CreateTableDto, UpdateTableDto } from "../dtos/admin-table.dto";
import { ADMIN_TABLE_CONSTANTS } from "../constants/admin-table.contant";

import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../auth/enums/role.enum";

@ApiTags("Admin - Tables")
@ApiBearerAuth()
@Controller("admin/tables")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.STAFF)
export class AdminTableController {
  constructor(private readonly adminTableService: AdminTableService) {}

  @Post()
  @ApiOperation({ summary: "Tạo bàn mới" })
  @ApiBody({ type: CreateTableDto })
  @ApiResponse({
    status: 201,
    description: ADMIN_TABLE_CONSTANTS.CREATE_SUCCESS,
  })
  async createTable(@Body() createTableDto: CreateTableDto) {
    return this.adminTableService.createTable(createTableDto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Cập nhật thông tin bàn" })
  @ApiParam({ name: "id", description: "ID của bàn" })
  @ApiBody({ type: UpdateTableDto })
  @ApiResponse({
    status: 200,
    description: ADMIN_TABLE_CONSTANTS.UPDATE_SUCCESS,
  })
  @ApiResponse({ status: 404, description: ADMIN_TABLE_CONSTANTS.NOTFOUND })
  async updateTable(
    @Param("id") id: string,
    @Body() updateTableDto: UpdateTableDto,
  ) {
    return this.adminTableService.updateTable(Number(id), updateTableDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Xóa bàn" })
  @ApiParam({ name: "id", description: "ID của bàn" })
  @ApiResponse({
    status: 200,
    description: ADMIN_TABLE_CONSTANTS.DELETE_SUCCESS,
  })
  @ApiResponse({ status: 404, description: ADMIN_TABLE_CONSTANTS.NOTFOUND })
  async deleteTable(@Param("id") id: string) {
    return this.adminTableService.deleteTable(Number(id));
  }

  @Get()
  @ApiOperation({ summary: "Lấy danh sách tất cả các bàn" })
  @ApiResponse({ status: 200, description: "Lấy danh sách thành công" })
  async getTables(@Query() query: any) {
    return this.adminTableService.getTables(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Lấy thông tin chi tiết một bàn" })
  @ApiParam({ name: "id", description: "ID của bàn" })
  @ApiResponse({ status: 200, description: "Thành công" })
  @ApiResponse({ status: 404, description: ADMIN_TABLE_CONSTANTS.NOTFOUND })
  async getTableById(@Param("id") id: string) {
    return this.adminTableService.getTableById(Number(id));
  }
}
