import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Query,
} from "@nestjs/common";
import { AdminManageUserService } from "../services/admin-manage_user.service";
import { CreateStaffDto, UpdateStaffDto } from "../dtos/admin-staff.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../auth/enums/role.enum";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Admin / Staff Management")
@Controller("admin/staff")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminStaffController {
  constructor(private readonly adminManageUserService: AdminManageUserService) { }

  @Get()
  @ApiOperation({ summary: "Lấy danh sách nhân viên" })
  async getStaff(@Query() query: any) {
    return this.adminManageUserService.findAll({ ...query, role: Role.STAFF });
  }

  @Post()
  @ApiOperation({ summary: "Tạo tài khoản nhân viên mới" })
  async createStaff(@Body() createStaffDto: CreateStaffDto) {
    return this.adminManageUserService.create({
      ...createStaffDto,
      role: Role.STAFF as any,
    });
  }

  @Patch(":id")
  @ApiOperation({ summary: "Cập nhật thông tin nhân viên" })
  async updateStaff(@Param("id") id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.adminManageUserService.update(id, updateStaffDto as any);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Xóa tài khoản nhân viên" })
  async deleteStaff(@Param("id") id: string, @Query("adminId") adminId: string) {
    return this.adminManageUserService.delete(adminId, id);
  }
}
