import { Controller } from "@nestjs/common";
import { AdminManageUserService } from "../services/admin-manage_user.service";
import {
  GetUsersDto,
  CreateUserDto,
  UpdateUserDto,
  DeleteUserDto,
} from "../dtos/admin-manage_user.dto";
import {
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../auth/enums/role.enum";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { UserEntity } from "../../user/entities/user.entity";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from "@nestjs/swagger";

@ApiTags("Admin / Manage Users")
@Controller("admin/users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@UseInterceptors(ClassSerializerInterceptor)
export class AdminManageUserController {
  constructor(
    private readonly adminManageUserService: AdminManageUserService,
  ) {}

  @Get()
  @ApiOperation({
    summary: "Lấy danh sách người dùng (có phân trang và tìm kiếm)",
  })
  @ApiResponse({
    status: 200,
    description: "Danh sách người dùng đã được lọc mật khẩu",
  })
  findAll(@Query() query: GetUsersDto) {
    return this.adminManageUserService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Lấy chi tiết một người dùng theo ID" })
  @ApiParam({ name: "id", description: "ID của người dùng cần lấy" })
  @ApiResponse({ status: 200, description: "Thông tin chi tiết người dùng" })
  @ApiResponse({ status: 404, description: "Không tìm thấy người dùng" })
  findOne(@Param("id") id: string) {
    return this.adminManageUserService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Tạo người dùng mới" })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: "Người dùng đã được tạo thành công",
  })
  @ApiResponse({ status: 409, description: "Email đã tồn tại" })
  create(@Body() createUserDto: CreateUserDto) {
    return this.adminManageUserService.create(createUserDto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Cập nhật thông tin người dùng" })
  @ApiParam({ name: "id", description: "ID của người dùng cần cập nhật" })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: "Thông tin người dùng đã được cập nhật",
  })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.adminManageUserService.update(id, updateUserDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Xóa người dùng" })
  @ApiParam({ name: "id", description: "ID của người dùng cần xóa" })
  @ApiResponse({
    status: 200,
    description: "Người dùng đã được xóa thành công",
  })
  remove(@Param("id") id: string, @CurrentUser() admin: UserEntity) {
    return this.adminManageUserService.delete(admin.id, id);
  }
}
