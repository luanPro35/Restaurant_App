import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import categoryApi, { Category } from "../../../services/api/category.api";

export const useAdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoryApi.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await categoryApi.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Error refreshing categories:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const getCategoryDetail = async (id: string): Promise<Category | null> => {
    try {
      return await categoryApi.getById(id);
    } catch (error: any) {
      console.error("Error getting category detail:", error);
      Alert.alert("Lỗi", "Không thể tải chi tiết danh mục");
      return null;
    }
  };

  const createCategory = async (data: {
    name: string;
    description?: string;
    image?: string;
    order?: number;
    slug?: string;
  }): Promise<boolean> => {
    try {
      const created = await categoryApi.create(data);
      setCategories((prev) => [created, ...prev]);
      Alert.alert("Thành công", `Đã tạo danh mục "${created.name}"`);
      return true;
    } catch (error: any) {
      console.error("Error creating category:", error);
      const msg =
        error?.response?.data?.message || "Không thể tạo danh mục mới";
      Alert.alert("Lỗi", typeof msg === "string" ? msg : JSON.stringify(msg));
      return false;
    }
  };

  const updateCategory = async (
    id: string,
    data: {
      name?: string;
      description?: string;
      image?: string;
      order?: number;
      slug?: string;
    }
  ): Promise<boolean> => {
    try {
      const updated = await categoryApi.update(id, data);
      setCategories((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
      );
      Alert.alert("Thành công", `Đã cập nhật danh mục "${updated.name}"`);
      return true;
    } catch (error: any) {
      console.error("Error updating category:", error);
      const msg =
        error?.response?.data?.message || "Không thể cập nhật danh mục";
      Alert.alert("Lỗi", typeof msg === "string" ? msg : JSON.stringify(msg));
      return false;
    }
  };

  const deleteCategory = async (id: string, name?: string): Promise<boolean> => {
    return new Promise((resolve) => {
      Alert.alert(
        "Xác nhận xóa",
        `Bạn có chắc chắn muốn xóa danh mục "${name || "này"}" không? Hành động này không thể hoàn tác.`,
        [
          { text: "Hủy", style: "cancel", onPress: () => resolve(false) },
          {
            text: "Xóa",
            style: "destructive",
            onPress: async () => {
              try {
                await categoryApi.delete(id);
                setCategories((prev) => prev.filter((item) => item.id !== id));
                Alert.alert("Thành công", "Đã xóa danh mục");
                resolve(true);
              } catch (error: any) {
                console.error("Error deleting category:", error);
                const msg =
                  error?.response?.data?.message || "Không thể xóa danh mục";
                Alert.alert(
                  "Không thể xóa",
                  typeof msg === "string" ? msg : JSON.stringify(msg)
                );
                resolve(false);
              }
            },
          },
        ]
      );
    });
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    refreshing,
    fetchCategories,
    handleRefresh,
    getCategoryDetail,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

export default useAdminCategories;
