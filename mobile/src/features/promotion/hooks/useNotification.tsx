import { useState, useEffect, useCallback } from "react";
import notificationService from "../services/Notification.service";
import {
  AdminNotification,
  AdminNotificationQuery,
} from "@/services/api/admin-notification";

export const useNotification = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchNotifications = useCallback(
    async (query: AdminNotificationQuery = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response = await notificationService.fetchNotifications(query);
        setNotifications(response.data || []);
        setTotal(response.total || 0);
        setPage(response.page || 1);
        setLimit(response.limit || 10);
      } catch (err: any) {
        setError(err.message || "Không thể tải danh sách thông báo");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications({ page: 1, limit });
    setRefreshing(false);
  };

  const getNotificationById = async (id: string) => {
    try {
      return await notificationService.getNotificationById(id);
    } catch (err: any) {
      throw new Error(err.message || "Không thể tải thông tin thông báo");
    }
  };

  useEffect(() => {
    fetchNotifications({ page: 1, limit: 10 });
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    refreshing,
    error,
    total,
    page,
    limit,
    fetchNotifications,
    handleRefresh,
    getNotificationById,
  };
};
