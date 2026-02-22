import { useState, useCallback, useEffect } from "react";
import notificationApi, {
  AdminNotification,
  AdminNotificationQuery,
  AdminNotificationResponse,
} from "../../../services/api/admin-notification";
import { Alert } from "react-native";
import { AdminPagination } from "../types/admin.types";

export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState<AdminPagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const mapPagination = (res: AdminNotificationResponse): AdminPagination => ({
    total: res.total,
    page: res.page,
    limit: res.limit,
    totalPages: res.totalPages ?? 0,
  });

  const fetchNotifications = useCallback(
    async (query?: AdminNotificationQuery) => {
      setLoading(true);
      try {
        const response = await notificationApi.getNotifications(query ?? {});
        setNotifications(response.data);
        setPagination(mapPagination(response));
      } catch (error) {
        console.error("Error fetching admin notifications:", error);
        Alert.alert("Lỗi", "Không thể tải danh sách thông báo");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications({ page: 1 });
    setRefreshing(false);
  };

  const getNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationApi.getNotifications({});
      setNotifications(response.data);
      setPagination(mapPagination(response));
    } catch (error) {
      console.error("Error fetching admin notifications:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách thông báo");
    } finally {
      setLoading(false);
    }
  };

  const getNotificationById = async (id: string) => {
    setLoading(true);
    try {
      const response = await notificationApi.getNotificationById(id);
      setNotifications((prev) => [...prev, response]);
    } catch (error) {
      console.error("Error fetching admin notification:", error);
      Alert.alert("Lỗi", "Không thể tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  const toggleNotificationStatus = async (id: string, isActive: boolean) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isActive } : n)),
      );
      await notificationApi.updateNotification(id, { isActive });
    } catch (error) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isActive: !isActive } : n)),
      );
      console.error("Error toggling notification status:", error);
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái thông báo");
    }
  };

  const deleteNotification = async (id: string) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa thông báo này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await notificationApi.deleteNotification(id);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            Alert.alert("Thành công", "Đã xóa thông báo");
          } catch (error) {
            console.error("Error deleting notification:", error);
            Alert.alert("Lỗi", "Không thể xóa thông báo");
          }
        },
      },
    ]);
  };

  const createNotification = async (
    notification: Omit<AdminNotification, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      const response = await notificationApi.createNotification(notification);
      setNotifications((prev) => [...prev, response]);
      Alert.alert("Thành công", "Đã tạo thông báo");
    } catch (error) {
      console.error("Error creating notification:", error);
      Alert.alert("Lỗi", "Không thể tạo thông báo");
    }
  };

  const updateNotification = async (
    id: string,
    notification: Partial<
      Omit<AdminNotification, "id" | "createdAt" | "updatedAt">
    >,
  ) => {
    try {
      const response = await notificationApi.updateNotification(
        id,
        notification,
      );
      setNotifications((prev) => prev.map((n) => (n.id === id ? response : n)));
      Alert.alert("Thành công", "Đã cập nhật thông báo");
    } catch (error) {
      console.error("Error updating notification:", error);
      Alert.alert("Lỗi", "Không thể cập nhật thông báo");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    refreshing,
    pagination,
    fetchNotifications,
    handleRefresh,
    toggleNotificationStatus,
    deleteNotification,
    createNotification,
    updateNotification,
    getNotificationById,
    getNotifications,
  };
};
