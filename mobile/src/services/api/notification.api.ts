import api from "./axios.instance";
import {
  AdminNotification,
  AdminNotificationResponse,
  AdminNotificationQuery,
} from "./admin-notification";

export const notificationApi = {
  // GET: /notifications
  getNotifications: async (
    query: AdminNotificationQuery,
  ): Promise<AdminNotificationResponse> => {
    const response = await api.get("/notifications", { params: query });
    return response.data;
  },

  // GET: /notifications/:id
  getNotificationById: async (id: string): Promise<AdminNotification> => {
    const response = await api.get(`/notifications/${id}`);
    return response.data;
  },
};

export default notificationApi;
