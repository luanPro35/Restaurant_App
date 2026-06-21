import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AdminNotificationService } from "../services/admin-notification.service";
import { GetNotificationsDto } from "../dtos/admin-notification.dto";
import { ADMIN_NOTIFICATION_CONSTANTS } from "../constants/admin-notification.contant";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";

@ApiTags("Notifications")
@ApiBearerAuth()
@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly service: AdminNotificationService) {}

  @Get()
  @ApiOperation({ summary: "Lấy danh sách thông báo cho người dùng" })
  @ApiResponse({ status: 200, description: "Thành công" })
  getNotifications(@Query() query: GetNotificationsDto) {
    return this.service.getNotifications({ ...query, isActive: true });
  }

  @Get(":id")
  @ApiOperation({ summary: "Lấy chi tiết thông báo theo ID" })
  @ApiParam({ name: "id", description: "ID thông báo" })
  @ApiResponse({ status: 200, description: "Thành công" })
  @ApiResponse({
    status: 404,
    description: ADMIN_NOTIFICATION_CONSTANTS.NOTFOUND,
  })
  getNotificationById(@Param("id") id: string) {
    return this.service.getNotificationById(id);
  }
}
