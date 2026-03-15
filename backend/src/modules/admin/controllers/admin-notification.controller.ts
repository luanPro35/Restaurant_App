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
import { AdminNotificationService } from "../services/admin-notification.service";
import {
  GetNotificationsDto,
  CreateNotificationDto,
  UpdateNotificationDto,
} from "../dtos/admin-notification.dto";
import { ADMIN_NOTIFICATION_CONSTANTS } from "../constants/admin-notification.contant";

import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../auth/enums/role.enum";

@ApiTags("Admin - Notifications")
@ApiBearerAuth()
@Controller("admin/notifications")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.STAFF)
export class AdminNotificationController {
  constructor(private readonly service: AdminNotificationService) {}

  @Get()
  @ApiOperation({ summary: "Lấy danh sách thông báo" })
  @ApiResponse({ status: 200, description: "Thành công" })
  getNotifications(@Query() query: GetNotificationsDto) {
    return this.service.getNotifications(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Lấy thông báo theo ID" })
  @ApiParam({ name: "id", description: "ID thông báo" })
  @ApiResponse({ status: 200, description: "Thành công" })
  @ApiResponse({
    status: 404,
    description: ADMIN_NOTIFICATION_CONSTANTS.NOTFOUND,
  })
  getNotificationById(@Param("id") id: string) {
    return this.service.getNotificationById(id);
  }

  @Post()
  @ApiOperation({ summary: "Tạo thông báo mới" })
  @ApiBody({ type: CreateNotificationDto })
  @ApiResponse({
    status: 201,
    description: ADMIN_NOTIFICATION_CONSTANTS.CREATED,
  })
  createNotification(@Body() data: CreateNotificationDto) {
    return this.service.createNotification(data);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Cập nhật thông báo" })
  @ApiParam({ name: "id", description: "ID thông báo" })
  @ApiBody({ type: UpdateNotificationDto })
  @ApiResponse({
    status: 200,
    description: ADMIN_NOTIFICATION_CONSTANTS.UPDATED,
  })
  @ApiResponse({
    status: 404,
    description: ADMIN_NOTIFICATION_CONSTANTS.NOTFOUND,
  })
  updateNotification(
    @Param("id") id: string,
    @Body() data: UpdateNotificationDto,
  ) {
    return this.service.updateNotification(id, data);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Xóa thông báo" })
  @ApiParam({ name: "id", description: "ID thông báo" })
  @ApiResponse({
    status: 200,
    description: ADMIN_NOTIFICATION_CONSTANTS.DELETED,
  })
  @ApiResponse({
    status: 404,
    description: ADMIN_NOTIFICATION_CONSTANTS.NOTFOUND,
  })
  deleteNotification(@Param("id") id: string) {
    return this.service.deleteNotification(id);
  }
}
