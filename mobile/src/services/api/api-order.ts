import api from "./axios.instance";

export interface ProductItem {
  productId: string;
  name?: string;
  price?: number;
  quantity: number;
  note?: string;
  status?: string;
}

export interface Order {
  id: string;
  tableId: string;
  tableName?: string;
  items: ProductItem[];
  totalAmount: number;
  status: string;
  type: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  tableId: string;
  items: {
    productId: string;
    quantity: number;
    note?: string;
  }[];
  type?: string;
  notes?: string;
}

export interface OrderResponse {
  data: Order;
  message?: string;
}


export const orderApi = {
  createOrder: async (data: CreateOrderDto): Promise<Order> => {
    const response = await api.post("/orders", data);
    return response.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getOrdersByTableId: async (tableId: string): Promise<Order> => {
    const response = await api.get(`/orders/table/${tableId}`);
    return response.data;
  },

  addItemsToOrder: async (orderId: string, items: any[]): Promise<Order> => {
    const response = await api.patch(`/orders/${orderId}/add-items`, { items });
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<Order> => {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  },
};
