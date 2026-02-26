import api from "./axios.instance";

export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  detail?: string;
  type: "HOME" | "OFFICE" | "OTHER";
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressDto {
  name: string;
  phone: string;
  address: string;
  detail?: string;
  type?: "HOME" | "OFFICE" | "OTHER";
  isDefault?: boolean;
}

export const addressApi = {
  // POST: /address
  create: async (data: CreateAddressDto): Promise<Address> => {
    const response = await api.post("/address", data);
    return response.data;
  },

  // GET: /address
  findAll: async (): Promise<Address[]> => {
    const response = await api.get("/address");
    return response.data;
  },

  // GET: /address/:id
  findOne: async (id: string): Promise<Address> => {
    const response = await api.get(`/address/${id}`);
    return response.data;
  },

  // PATCH: /address/:id
  update: async (
    id: string,
    data: Partial<CreateAddressDto>,
  ): Promise<Address> => {
    const response = await api.patch(`/address/${id}`, data);
    return response.data;
  },

  // DELETE: /address/:id
  remove: async (id: string): Promise<void> => {
    await api.delete(`/address/${id}`);
  },
};

export default addressApi;
