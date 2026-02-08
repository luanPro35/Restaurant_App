import apiProducts from "../../../services/api/apiProducts";

export const menuService = {
  fetchMenu: async (params?: any) => {
    const response = await apiProducts.getAll(params);
    return response;
  },
};
