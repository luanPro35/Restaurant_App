import api from "./axios.instance";

export interface Message {
    id: string;
    text: string;
    isMe: boolean;
    product?: string;
    productId?: string;
    suggestions?: string[];
    type?: string;
    recommendedProducts?: any[];
}

export const aiApi = {
    chat: async (message: string, userId?: string) => {
        try {
            const response = await api.get(`/ai/chat`, {
                params: {
                    message: message,
                    userId: userId
                },
                timeout: 60000
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getHistory: async (userId: string) => {
        try {
            const response = await api.get(`/ai/history`, {
                params: { userId }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default aiApi;

