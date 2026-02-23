import { useState, useEffect, useCallback } from "react";
import adminApi from "../admin-api";
import { Alert } from "react-native";
import {
  AdminProduct,
  AdminProductQuery,
  AdminPagination,
  AdminProductResponse,
} from "../types/admin.types";

export const useAdminProducts = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState<AdminPagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchProducts = useCallback(async (query?: AdminProductQuery) => {
    setLoading(true);
    try {
      const response: AdminProductResponse =
        await adminApi.products.getAll(query);
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching admin products:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts({ page: 1 });
    setRefreshing(false);
  };

  const toggleAvailability = async (id: string, isAvailable: boolean) => {
    try {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isAvailable } : p)),
      );
      await adminApi.products.toggleAvailability(id, isAvailable);
    } catch (error) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isAvailable: !isAvailable } : p,
        ),
      );
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái sản phẩm");
    }
  };

  const deleteProduct = async (id: string) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa sản phẩm này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await adminApi.products.delete(id);
            setProducts((prev) => prev.filter((p) => p.id !== id));
          } catch (error) {
            Alert.alert("Lỗi", "Không thể xóa sản phẩm");
          }
        },
      },
    ]);
  };

  const getProductById = async (id: string) => {
    try {
      const response = await adminApi.products.getById(id);
      return response.data;
    } catch (error) {
      console.error("Error fetching admin product:", error);
      Alert.alert("Lỗi", "Không thể tải sản phẩm");
    }
  };

  const getProductAll = async () => {
    try {
      const response = await adminApi.products.getAll();
      return response.data;
    } catch (error) {
      console.error("Error fetching admin products:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách sản phẩm");
    }
  };

  const updateProduct = async (id: string, productData: any) => {
    try {
      const response = await adminApi.products.update(id, productData);
      return response.data;
    } catch (error) {
      console.error("Error updating admin product:", error);
      Alert.alert("Lỗi", "Không thể cập nhật sản phẩm");
    }
  };

  const createProduct = async (productData: any) => {
    try {
      const response = await adminApi.products.create(productData);
      return response.data;
    } catch (error) {
      console.error("Error creating admin product:", error);
      Alert.alert("Lỗi", "Không thể tạo sản phẩm");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    refreshing,
    pagination,
    fetchProducts,
    handleRefresh,
    toggleAvailability,
    deleteProduct,
    getProductById,
    getProductAll,
    updateProduct,
    createProduct,
  };
};
