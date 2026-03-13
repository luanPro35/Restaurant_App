import { tableApi, AdminTableQuery } from "../../../services/api/api-table";
import { useState, useCallback, useEffect } from "react";
import { Alert } from "react-native";
import {
  AdminTable,
  AdminPagination,
  AdminTableResponse,
} from "../types/admin.types";

export const useAdminTable = () => {
  const [tables, setTables] = useState<AdminTable[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState<AdminPagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchTables = useCallback(async (query?: AdminTableQuery) => {
    setLoading(true);
    try {
      const response: AdminTableResponse = await tableApi.getAdminTables(
        query as any,
      );
      setTables(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching admin tables:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách bàn");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTables({ page: 1 });
    setRefreshing(false);
  };

  const getTables = async () => {
    setLoading(true);
    try {
      const response: AdminTableResponse = await tableApi.getAdminTables({});
      setTables(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching admin tables:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách bàn");
    } finally {
      setLoading(false);
    }
  };

  const getTableById = async (id: number) => {
    setLoading(true);
    try {
      const response: AdminTable = await tableApi.getAdminTableById(id);
      setTables((prev) => [...prev, response]);
    } catch (error) {
      console.error("Error fetching admin table:", error);
      Alert.alert("Lỗi", "Không thể tải bàn");
    } finally {
      setLoading(false);
    }
  };

  const toggleTableStatus = async (id: number, isActive: boolean) => {
    try {
      setTables((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isActive } : t)),
      );
      await tableApi.updateTable(id, { isActive });
    } catch (error) {
      setTables((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isActive: !isActive } : t)),
      );
      console.error("Error toggling table status:", error);
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái bàn");
    }
  };

  const deleteTable = async (id: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa bàn này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await tableApi.deleteTable(id);
            setTables((prev) => prev.filter((t) => t.id !== id));
            Alert.alert("Thành công", "Đã xóa bàn");
          } catch (error) {
            console.error("Error deleting table:", error);
            Alert.alert("Lỗi", "Không thể xóa bàn");
          }
        },
      },
    ]);
  };

  const createTable = async (table: Omit<AdminTable, "id">) => {
    try {
      const response = await tableApi.createTable(table);
      setTables((prev) => [...prev, response]);
      Alert.alert("Thành công", "Đã tạo bàn");
    } catch (error) {
      console.error("Error creating table:", error);
      Alert.alert("Lỗi", "Không thể tạo bàn");
    }
  };

  const updateTable = async (id: number, table: Partial<AdminTable>) => {
    try {
      const response = await tableApi.updateTable(id, table);
      setTables((prev) => prev.map((t) => (t.id === id ? response : t)));
      Alert.alert("Thành công", "Đã cập nhật bàn");
    } catch (error) {
      console.error("Error updating table:", error);
      Alert.alert("Lỗi", "Không thể cập nhật bàn");
    }
  };

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  return {
    tables,
    loading,
    refreshing,
    pagination,
    fetchTables,
    handleRefresh,
    toggleTableStatus,
    deleteTable,
    createTable,
    updateTable,
    getTableById,
    getTables,
  };
};
