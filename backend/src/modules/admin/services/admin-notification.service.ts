import { Injectable, NotFoundException } from "@nestjs/common";
import { AdminNotificationRepository } from "../repositories/admin-notification.repository";
import {
  CreateNotificationDto,
  GetNotificationsDto,
  UpdateNotificationDto,
} from "../dtos/admin-notification.dto";
import {
  CreateNotificationSchema,
  UpdateNotificationSchema,
  GetNotificationsSchema,
  DeleteNotificationSchema,
} from "../validations/admin-notification.validation";
import { ADMIN_NOTIFICATION_CONSTANTS } from "../constants/admin-notification.contant";

@Injectable()
export class AdminNotificationService {
  constructor(private readonly repository: AdminNotificationRepository) {}

  async getNotifications(query: GetNotificationsDto) {
    GetNotificationsSchema.parse(query);
    return this.repository.findAll(query);
  }

  async getNotificationById(id: string) {
    DeleteNotificationSchema.parse({ id });
    const notification = await this.repository.findById(id);
    if (!notification) {
      throw new NotFoundException(ADMIN_NOTIFICATION_CONSTANTS.NOTFOUND);
    }
    return notification;
  }

  async createNotification(data: CreateNotificationDto) {
    CreateNotificationSchema.parse(data);
    return this.repository.create(data);
  }

  async updateNotification(id: string, data: UpdateNotificationDto) {
    UpdateNotificationSchema.parse(data);
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException(ADMIN_NOTIFICATION_CONSTANTS.NOTFOUND);
    }
    return this.repository.update(id, data);
  }

  async deleteNotification(id: string) {
    DeleteNotificationSchema.parse({ id });
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException(ADMIN_NOTIFICATION_CONSTANTS.NOTFOUND);
    }
    await this.repository.delete(id);
    return { message: ADMIN_NOTIFICATION_CONSTANTS.DELETED };
  }
}
