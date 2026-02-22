export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  STAFF = "STAFF",
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserQuery {
  name?: string;
  email?: string;
  role?: UserRole;
  page?: number;
  limit?: number;
}

export interface AdminUserPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminUserResponse {
  data: AdminUser[];
  pagination: AdminUserPagination;
}

export interface CreateAdminUserDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateAdminUserDto {
  name?: string;
  role?: UserRole;
}
