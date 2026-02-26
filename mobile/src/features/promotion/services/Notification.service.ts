import notificationApi from "@/services/api/notification.api";
import { AdminNotificationQuery } from "@/services/api/admin-notification";

const notificationService = {
  fetchNotifications: async (query: AdminNotificationQuery = {}) => {
    return await notificationApi.getNotifications(query);
  },

  getNotificationById: async (id: string) => {
    return await notificationApi.getNotificationById(id);
  },
};

export default notificationService;
