import { useState } from "react";
import { paymentApi } from "../../../services/api/api-payment";

export const useVietQr = () => {
    const [vietQr, setVietQr] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createVietQrForPackage = async (packageId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await paymentApi.createVietQrForPackage(packageId);
            setVietQr(response);
            return response;
        } catch (error: any) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getVietQrByOrderId = async (orderId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await paymentApi.getVietQrByOrderId(orderId);
            setVietQr(response);
            return response;
        } catch (error: any) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createVietQrForOrder = async (orderId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await paymentApi.createVietQrForOrder(orderId);
            setVietQr(response);
            return response;
        } catch (error: any) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        vietQr,
        loading,
        error,
        createVietQrForPackage,
        getVietQrByOrderId,
        createVietQrForOrder,
    };
};