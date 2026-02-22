import api from "./axios.instance";

export interface AdminNotification {
  id: string;
  title: string;
  content: string;
  body?: string;
  description?: string;
  isActive?: boolean;
  startAt?: string;
  endAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminNotificationQuery {
  search?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface AdminNotificationResponse {
  data: AdminNotification[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export const notificationApi = {
  // GET: /admin/notifications
  getNotifications: async (
    query: AdminNotificationQuery,
  ): Promise<AdminNotificationResponse> => {
    const response = await api.get("/admin/notifications", { params: query });
    return response.data;
  },

  // GET: /admin/notifications/:id
  getNotificationById: async (id: string): Promise<AdminNotification> => {
    const response = await api.get(`/admin/notifications/${id}`);
    return response.data;
  },

  // POST: /admin/notifications
  createNotification: async (
    data: Omit<AdminNotification, "id" | "createdAt" | "updatedAt">,
  ): Promise<AdminNotification> => {
    const response = await api.post("/admin/notifications", data);
    return response.data;
  },

  // PATCH: /admin/notifications/:id
  updateNotification: async (
    id: string,
    data: Partial<Omit<AdminNotification, "id" | "createdAt" | "updatedAt">>,
  ): Promise<AdminNotification> => {
    const response = await api.patch(`/admin/notifications/${id}`, data);
    return response.data;
  },

  // DELETE: /admin/notifications/:id
  deleteNotification: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/admin/notifications/${id}`);
    return response.data;
  },
};

export default notificationApi;
