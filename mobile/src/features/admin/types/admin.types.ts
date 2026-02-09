export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  images: string;
  isAvailable: boolean;
  category?: {
    id: string;
    name: string;
  };
  unit?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminProductQuery {
  search?: string;
  category?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface AdminPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminProductResponse {
  data: AdminProduct[];
  pagination: AdminPagination;
}
