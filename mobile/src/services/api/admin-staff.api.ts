import api from "./axios.instance";
import {
  AdminUserResponse,
  CreateAdminUserDto,
  UpdateAdminUserDto,
  AdminUser,
} from "../../features/admin/types/admin-user.types";

export const adminStaffApi = {
  getStaff: async (params: any): Promise<AdminUserResponse> => {
    const response = await api.get("/admin/staff", { params });
    return response.data;
  },

  createStaff: async (data: CreateAdminUserDto): Promise<AdminUser> => {
    const response = await api.post("/admin/staff", data);
    return response.data;
  },

  updateStaff: async (id: string, data: UpdateAdminUserDto): Promise<AdminUser> => {
    const response = await api.patch(`/admin/staff/${id}`, data);
    return response.data;
  },

  deleteStaff: async (id: string): Promise<any> => {
    // Note: On backend we need adminId, but usually it's extracted from token
    // If your backend requires it as query param, we add it. 
    // But let's assume it uses the token for now since we have JwtAuthGuard.
    const response = await api.delete(`/admin/staff/${id}`);
    return response.data;
  },
};

export default adminStaffApi;
