import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import adminStaffApi from "../../../services/api/admin-staff.api";
import {
  AdminUser,
  CreateAdminUserDto,
  UpdateAdminUserDto,
} from "../types/admin-user.types";

export const useAdminStaff = () => {
  const [staff, setStaff] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStaff = useCallback(
    async (pageNum = 1, isRefresh = false) => {
      try {
        if (pageNum === 1 && !isRefresh) setLoading(true);

        const response = await adminStaffApi.getStaff({
          name: search,
          page: pageNum,
          limit: 10,
        });

        if (pageNum === 1) {
          setStaff(response.data);
        } else {
          setStaff((prev) => [...prev, ...response.data]);
        }

        setTotalPages(response.pagination.totalPages);
        setPage(pageNum);
      } catch (error) {
        console.error("Fetch staff error:", error);
        Alert.alert("Lỗi", "Không thể tải danh sách nhân viên");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [search],
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStaff(1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, fetchStaff]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStaff(1, true);
  };

  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      fetchStaff(page + 1);
    }
  };

  const deleteStaff = async (id: string) => {
    try {
      await adminStaffApi.deleteStaff(id);
      fetchStaff(1, true);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Không thể xóa nhân viên";
      Alert.alert("Lỗi", msg);
      throw error;
    }
  };

  const saveStaff = async (
    data: CreateAdminUserDto | UpdateAdminUserDto,
    selectedId?: string,
  ) => {
    try {
      if (selectedId) {
        await adminStaffApi.updateStaff(selectedId, data as UpdateAdminUserDto);
      } else {
        await adminStaffApi.createStaff(data as CreateAdminUserDto);
      }
      fetchStaff(1, true);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Có lỗi xảy ra";
      Alert.alert("Lỗi", msg);
      throw error;
    }
  };

  return {
    staff,
    loading,
    refreshing,
    search,
    setSearch,
    onRefresh,
    handleLoadMore,
    deleteStaff,
    saveStaff,
    refreshList: () => fetchStaff(1, true),
  };
};
