export interface Promotion {
  id: string;
  name: string;
  discount: number;
  until: string;
  isActive: boolean;
  image?: string;
  code?: string;
  minOrder?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PromotionResponse {
  data: Promotion[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PromotionQuery {
  name?: string;
  page?: number;
  limit?: number;
}
