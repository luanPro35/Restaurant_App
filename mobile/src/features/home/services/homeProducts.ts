import { productApi } from "../../../services/api/apiProducts";

const HOME_PRODUCT_LIMIT = 40;
let homeProductsRequest: Promise<any[]> | null = null;

/** Share the same small product request between all horizontal home sections. */
export const getHomeProducts = (): Promise<any[]> => {
  if (!homeProductsRequest) {
    homeProductsRequest = productApi
      .getAll({ limit: HOME_PRODUCT_LIMIT })
      .then((response) => {
        if (Array.isArray(response)) return response;
        return Array.isArray(response?.data) ? response.data : [];
      })
      .catch((error) => {
        homeProductsRequest = null;
        throw error;
      });
  }

  return homeProductsRequest;
};
