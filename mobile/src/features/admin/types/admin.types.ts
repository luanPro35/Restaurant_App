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

export interface AdminTable {
  id: string;
  name: string;
  capacity: number;
  status: string;
  isAvailable: boolean;
  listFoods?: string[];
  price: number;
  isActive: boolean;
  qrCode?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminTableResponse {
  data: AdminTable[];
  pagination: AdminPagination;
}

export interface AdminOrder {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
  until: string;
  address: string;
}

export interface AdminPromotion {
  id: string;
  name: string;
  discount: number;
  until: string;
  isActive: boolean;
  code?: string;
  minOrder?: number;
  image?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
