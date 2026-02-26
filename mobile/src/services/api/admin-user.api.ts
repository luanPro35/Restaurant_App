export * from "../../features/admin/types/admin-user.types";
import api from "./axios.instance";
import {
  AdminUserQuery,
  AdminUserResponse,
  AdminUser,
  CreateAdminUserDto,
  UpdateAdminUserDto,
} from "../../features/admin/types/admin-user.types";

export const adminUserApi = {
  // GET: /admin/users
  getUsers: async (query: AdminUserQuery): Promise<AdminUserResponse> => {
    const response = await api.get("/admin/users", { params: query });
    return response.data;
  },

  // GET: /admin/users/:id
  getUserById: async (id: string): Promise<AdminUser> => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // POST: /admin/users
  createUser: async (userData: CreateAdminUserDto): Promise<AdminUser> => {
    const response = await api.post("/admin/users", userData);
    return response.data;
  },

  // PATCH: /admin/users/:id
  updateUser: async (
    id: string,
    userData: UpdateAdminUserDto,
  ): Promise<AdminUser> => {
    const response = await api.patch(`/admin/users/${id}`, userData);
    return response.data;
  },

  // DELETE: /admin/users/:id
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },
};

export default adminUserApi;
