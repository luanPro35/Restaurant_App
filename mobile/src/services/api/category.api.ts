import api from "./axios.instance";

export interface CategoryProduct {
  id: string;
  name: string;
  price: number;
  images: string;
  isAvailable: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    products: number;
  };
  products?: CategoryProduct[];
}

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get("/categories");
    return response.data;
  },

  getById: async (id: string): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data: Partial<Category>): Promise<Category> => {
    const response = await api.post("/categories", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Category>): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  uploadImage: async (formData: FormData): Promise<{ url: string }> => {
    const response = await api.post("/admin/products/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default categoryApi;

