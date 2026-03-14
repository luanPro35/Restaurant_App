import { useState } from "react";
import { paymentApi, Payment } from "../../../services/api/api-payment";

export const usePayment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    const fetchPayments = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await paymentApi.getAll();
            setPayments(data);
        } catch (error) {
            setError("Failed to fetch payments");
        } finally {
            setLoading(false);
        }
    };

    const fetchTotalAmount = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await paymentApi.getTotalAmount();
            setTotalAmount(data);
        } catch (error) {
            setError("Failed to fetch total amount");
        } finally {
            setLoading(false);
        }
    }

    return {
        payments,
        loading,
        error,
        fetchPayments,
        fetchTotalAmount,
        totalAmount
    };
};