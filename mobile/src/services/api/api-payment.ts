import api from "./axios.instance";

export interface Payment {
    id: string;
    orderId?: string | null;
    packageId?: string | null;
    userId?: string;
    amount: number;
    method: string;
    status: string;
    transactionId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PaymentAnalytics {
    summary: {
        totalRevenue: number;
        revenueToday: number;
        totalOrders: number;
        ordersToday: number;
        completedToday: number;
        activeOrders: number;
    };
    daily: Array<{
        dateLabel: string;
        dayName: string;
        revenue: number;
        ordersCount: number;
        rawDate: string;
    }>;
    paymentBreakdown: {
        vietQr: { total: number; count: number; percent: number };
        cash: { total: number; count: number; percent: number };
        bank: { total: number; count: number; percent: number };
        grandTotal: number;
        totalTransactions: number;
    };
    topDishes: Array<{
        id: string;
        name: string;
        salesCount: number;
        price: number;
        totalRevenue: number;
        tag: "STAR" | "POTENTIAL" | "POPULAR";
    }>;
    recentPayments: Payment[];
}

export const paymentApi = {
    createVietQrForPackage: async (packageId: string): Promise<any> => {
        const response = await api.post(`/vietqr/package/${packageId}`);
        return response.data;
    },
    getVietQrByOrderId: async (orderId: string): Promise<any> => {
        const response = await api.get(`/vietqr/order/${orderId}`);
        return response.data;
    },
    createVietQrForOrder: async (orderId: string): Promise<any> => {
        const response = await api.post(`/vietqr/order/${orderId}`);
        return response.data;
    },
    getAll: async (query?: any): Promise<Payment[]> => {
        const response = await api.get(`/payments`, { params: query });
        return response.data?.data || response.data || [];
    },
    getTotalAmount: async (): Promise<number> => {
        const response = await api.get(`/payments/total-amount`);
        return response.data?._sum?.amount || 0;
    },
    getTotalAmountToday: async (): Promise<number> => {
        const response = await api.get(`/payments/total-amount-today`);
        return response.data?._sum?.amount || 0;
    },
    getAnalytics: async (period: "TODAY" | "7DAYS" | "30DAYS" | "ALL"): Promise<PaymentAnalytics> => {
        const response = await api.get(`/payments/analytics`, { params: { period } });
        return response.data;
    },
    uploadReceipt: async (formData: FormData): Promise<any> => {
        const response = await api.post(`/payments/upload-receipt`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    checkStatus: async (params: { packageId?: string; orderId?: string }): Promise<{ isPaid: boolean; status?: string; paymentId?: string }> => {
        const response = await api.get(`/payments/check-status`, { params });
        return response.data;
    },
};

export default paymentApi;
