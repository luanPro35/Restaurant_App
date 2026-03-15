import { AdminTableService } from "../admin/services/admin-table.service";
import { Controller, Get, Param, Query, Patch, Body, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
} from "@nestjs/swagger";
import { UpdateTableDto } from "../admin/dtos/admin-table.dto";

@ApiTags("Tables")
@Controller("tables")
export class TableController {
  constructor(private readonly adminTableService: AdminTableService) { }

  @Get()
  @ApiOperation({ summary: "Lấy danh sách tất cả các bàn" })
  @ApiResponse({ status: 200, description: "Thành công" })
  async getAllTables(@Query() query: any) {
    return this.adminTableService.getTables(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Lấy thông tin chi tiết của một bàn" })
  @ApiParam({ name: "id", description: "ID của bàn" })
  @ApiResponse({ status: 200, description: "Thành công" })
  @ApiResponse({ status: 404, description: "Không tìm thấy bàn" })
  async getTableById(@Param("id") id: string) {
    return this.adminTableService.getTableById(Number(id));
  }

  @Get("qr/:tableNumber")
  @ApiOperation({ summary: "Tìm bàn theo số (Dành cho QR Code)" })
  @ApiParam({ name: "tableNumber", description: "Số bàn trích xuất từ QR" })
  @ApiResponse({ status: 200, description: "Thành công" })
  @ApiResponse({ status: 404, description: "Không tìm thấy bàn" })
  async getTableByQr(@Param("tableNumber") tableNumber: string) {
    return this.adminTableService.findTableByNumber(tableNumber);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Cập nhật trạng thái bàn (Nhân viên/Admin)" })
  @ApiParam({ name: "id", description: "ID của bàn" })
  @ApiBody({ type: UpdateTableDto })
  @ApiResponse({ status: 200, description: "Cập nhật thành công" })
  async updateTableStatus(
    @Param("id") id: string,
    @Body() updateTableDto: UpdateTableDto,
  ) {
    return this.adminTableService.updateTable(Number(id), updateTableDto);
  }
}
