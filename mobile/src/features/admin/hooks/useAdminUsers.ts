import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import adminUserApi from "../../../services/api/admin-user.api";
import {
  AdminUser,
  CreateAdminUserDto,
  UpdateAdminUserDto,
} from "../types/admin-user.types";

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(
    async (pageNum = 1, isRefresh = false) => {
      try {
        if (pageNum === 1 && !isRefresh) setLoading(true);

        const response = await adminUserApi.getUsers({
          name: search,
          page: pageNum,
          limit: 10,
        });

        if (pageNum === 1) {
          setUsers(response.data);
        } else {
          setUsers((prev) => [...prev, ...response.data]);
        }

        setTotalPages(response.pagination.totalPages);
        setPage(pageNum);
      } catch (error) {
        console.error("Fetch users error:", error);
        Alert.alert("Lỗi", "Không thể tải danh sách người dùng");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [search],
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, fetchUsers]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers(1, true);
  };

  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      fetchUsers(page + 1);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await adminUserApi.deleteUser(id);
      fetchUsers(1, true);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Không thể xóa người dùng";
      Alert.alert("Lỗi", msg);
      throw error;
    }
  };

  const saveUser = async (
    data: CreateAdminUserDto | UpdateAdminUserDto,
    selectedId?: string,
  ) => {
    try {
      if (selectedId) {
        await adminUserApi.updateUser(selectedId, data as UpdateAdminUserDto);
      } else {
        await adminUserApi.createUser(data as CreateAdminUserDto);
      }
      fetchUsers(1, true);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Có lỗi xảy ra";
      Alert.alert("Lỗi", msg);
      throw error;
    }
  };

  return {
    users,
    loading,
    refreshing,
    search,
    setSearch,
    onRefresh,
    handleLoadMore,
    deleteUser,
    saveUser,
    refreshList: () => fetchUsers(1, true),
  };
};
