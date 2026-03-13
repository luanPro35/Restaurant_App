import api from "./axios.instance";

export const paymentApi = {
    createVietQrForPackage: async (packageId: string): Promise<any> => {
        const response = await api.post(`/vietqr/package/${packageId}`);
        return response.data;
    },
    getVietQrByOrderId: async (orderId: string): Promise<any> => {
        const response = await api.get(`/vietqr/order/${orderId}`);
        return response.data;
    },
};

export default paymentApi;
