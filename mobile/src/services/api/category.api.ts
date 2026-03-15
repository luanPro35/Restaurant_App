import api from "./axios.instance";

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get("/categories");
    return response.data;
  },
};

export default categoryApi;
