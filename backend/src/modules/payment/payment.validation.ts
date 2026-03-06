import { z } from "zod";
import { PAYMENT_METHOD } from "./payment.contant";

export const createPaymentSchema = z.object({
    orderId: z.string().min(1, "ID đơn hàng không được để trống"),
    method: z.nativeEnum(PAYMENT_METHOD),
    amount: z.number().min(0, "Số tiền không được âm"),
});