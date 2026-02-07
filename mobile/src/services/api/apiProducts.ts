import api from "./axios.instance";

export interface ProductQuery {
  search?: string;
  category?: string;
  sortOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
  unit?: string;
  isAvailable?: boolean;
  isBestSeller?: boolean;
  page?: number;
  limit?: number;
}

export const productApi = {
  // GET: http://localhost:4000/api/v1/products (with query params for filtering/sorting/pagination)
  getAll: async (params?: ProductQuery) => {
    const response = await api.get("/products", { params });
    return response.data;
  },

  // GET: http://localhost:4000/api/v1/products/:id
  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // POST: http://localhost:4000/api/v1/products
  create: async (productData: any) => {
    const response = await api.post("/products", productData);
    return response.data;
  },

  // PATCH: http://localhost:4000/api/v1/products/:id
  update: async (id: string, productData: any) => {
    const response = await api.patch(`/products/${id}`, productData);
    return response.data;
  },

  // DELETE: http://localhost:4000/api/v1/products/:id
  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // PATCH: http://localhost:4000/api/v1/products/:id/availability
  toggleAvailability: async (id: string, isAvailable: boolean) => {
    const response = await api.patch(`/products/${id}/availability`, {
      isAvailable,
    });
    return response.data;
  },
};

export default productApi;
