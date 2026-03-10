import { useState, useCallback, useEffect } from "react";
import { Alert } from "react-native";
import { tableApi, AdminTableQuery } from "../../../services/api/api-table";
import {
  AdminTable,
  AdminPagination,
  AdminTableResponse,
} from "../../admin/types/admin.types";
import { orderApi } from "../../../services/api/api-order";

export const useTable = () => {
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
      const response: AdminTableResponse = await tableApi.getTables(query);
      setTables(response?.data || response || []);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching tables:", error);
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

  const getTableById = async (id: number) => {
    setLoading(true);
    try {
      const response = await tableApi.getTableById(id);
      return response;
    } catch (error) {
      console.error("Error fetching table detail:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin bàn");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTable = async (id: number, data: any) => {
    setLoading(true);
    try {
      const response = await tableApi.updateTablePublic(id, data);
      return response;
    } catch (error) {
      console.error("Error updating table:", error);
      Alert.alert("Lỗi", "Không thể cập nhật bàn");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getOrdersByTableId = async (tableId: number) => {
    setLoading(true);
    try {
      const response = await orderApi.getOrdersByTableId(tableId);
      return response;
    } catch (error) {
      console.error("Error fetching orders by table ID:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách đơn hàng");
      return null;
    } finally {
      setLoading(false);
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
    getTableById,
    updateTable,
    getOrdersByTableId,
  };
};
