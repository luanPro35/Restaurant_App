import api from "./axios.instance";
import {
  AdminTable,
  AdminTableResponse,
  AdminPagination,
} from "../../features/admin/types/admin.types";

export interface AdminTableQuery {
  status?: string;
  location?: string;
  page?: number;
  limit?: number;
}

export const tableApi = {
  getAdminTables: async (
    query?: AdminTableQuery,
  ): Promise<AdminTableResponse> => {
    const response = await api.get("/admin/tables", { params: query });
    return response.data;
  },

  getAdminTableById: async (id: string): Promise<AdminTable> => {
    const response = await api.get(`/admin/tables/${id}`);
    return response.data;
  },

  createTable: async (data: Omit<AdminTable, "id">): Promise<AdminTable> => {
    const response = await api.post("/admin/tables", data);
    return response.data;
  },

  updateTable: async (
    id: string,
    data: Partial<AdminTable>,
  ): Promise<AdminTable> => {
    const response = await api.patch(`/admin/tables/${id}`, data);
    return response.data;
  },

  deleteTable: async (id: string): Promise<void> => {
    await api.delete(`/admin/tables/${id}`);
  },

  getTables: async (query?: AdminTableQuery): Promise<AdminTableResponse> => {
    const response = await api.get("/tables", { params: query });
    return response.data;
  },

  getTableById: async (id: string): Promise<AdminTable> => {
    const response = await api.get(`/tables/${id}`);
    return response.data;
  },

  updateTablePublic: async (
    id: string,
    data: Partial<AdminTable>,
  ): Promise<AdminTable> => {
    const response = await api.patch(`/tables/${id}`, data);
    return response.data;
  },
};

export default tableApi;
