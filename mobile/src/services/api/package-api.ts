import api from "./axios.instance";

export type PackageStatusType =
  | "PENDING"
  | "CONFIRMED"
  | "COOKING"
  | "DELIVERING"
  | "RECEIVED"
  | "COMPLETED"
  | "CANCELED";

export interface Package {
  note?: string | null;
  refundPending?: boolean;
  id: string;
  name: string;
  address: string;
  description?: string;
  price: number;
  status: PackageStatusType;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePackageDto {
  note?: string;
  name: string;
  address: string;
  description?: string;
  price: number;
  status?: PackageStatusType;
  paymentMethod: string;
  userId?: string;
}

export const packageApi = {
  cancel: async (id: string): Promise<Package> => {
    const response = await api.patch(`/packages/${id}/cancel`);
    return response.data;
  },
  // GET: /packages
  findAll: async (): Promise<Package[]> => {
    const response = await api.get("/packages");
    return response.data;
  },

  // GET: /packages/:id
  findOne: async (id: string): Promise<Package> => {
    const response = await api.get(`/packages/${id}`);
    return response.data;
  },

  // POST: /packages
  create: async (data: CreatePackageDto): Promise<Package> => {
    const response = await api.post("/packages", data);
    return response.data;
  },

  // PATCH: /packages/:id
  update: async (id: string, data: Partial<CreatePackageDto>): Promise<Package> => {
    const response = await api.patch(`/packages/${id}`, data);
    return response.data;
  },

  // DELETE: /packages/:id
  remove: async (id: string): Promise<void> => {
    await api.delete(`/packages/${id}`);
  },

  count: async (): Promise<number> => {
    const response = await api.get("/packages/count");
    return response.data;
  },

  findAllPackage: async (): Promise<Package[]> => {
    const response = await api.get("/packages/people");
    return response.data;
  },
};

export default packageApi;
