import api from "../../services/api/axios.instance";
import { AdminProductQuery, AdminProductResponse } from "./types/admin.types";

export const adminApi = {
  // Admin Product APIs
  products: {
    // GET: /api/v1/admin/products
    getAll: async (
      params?: AdminProductQuery,
    ): Promise<AdminProductResponse> => {
      const response = await api.get("/admin/products", { params });
      return response.data;
    },

    // GET: /api/v1/admin/products/:id
    getById: async (id: string) => {
      const response = await api.get(`/admin/products/${id}`);
      return response.data;
    },

    // POST: /api/v1/admin/products/upload
    uploadImage: async (formData: FormData) => {
      const response = await api.post("/admin/products/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },

    // POST: /api/v1/admin/products
    create: async (productData: any) => {
      const response = await api.post("/admin/products", productData);
      return response.data;
    },

    // PATCH: /api/v1/admin/products/:id
    update: async (id: string, productData: any) => {
      const response = await api.patch(`/admin/products/${id}`, productData);
      return response.data;
    },

    // DELETE: /api/v1/admin/products/:id
    delete: async (id: string) => {
      const response = await api.delete(`/admin/products/${id}`);
      return response.data;
    },

    // PATCH: /api/v1/admin/products/:id/availability
    toggleAvailability: async (id: string, isAvailable: boolean) => {
      const response = await api.patch(`/admin/products/${id}/availability`, {
        isAvailable,
      });
      return response.data;
    },
  },

  // Admin Category APIs
  categories: {
    getAll: async () => {
      const response = await api.get("/categories");
      return response.data;
    },

    getById: async (id: string) => {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    },

    create: async (categoryData: any) => {
      const response = await api.post("/categories", categoryData);
      return response.data;
    },

    update: async (id: string, categoryData: any) => {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    },

    delete: async (id: string) => {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    },

    uploadImage: async (formData: FormData) => {
      const response = await api.post("/admin/products/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  },
};

export default adminApi;

