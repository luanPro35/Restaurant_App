import api from "./axios.instance";

export interface Payment {
    id: string;
    orderId: string;
    userId?: string;
    amount: number;
    method: string;
    status: string;
    transactionId?: string;
    createdAt: string;
    updatedAt: string;
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
    getAll: async (): Promise<Payment[]> => {
        const response = await api.get(`/payments`);
        return response.data.data;
    },
    getTotalAmount: async (): Promise<number> => {
        const response = await api.get(`/payments/total-amount`);
        return response.data?._sum?.amount || 0;
    },
};

export default paymentApi;
