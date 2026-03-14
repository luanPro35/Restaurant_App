import { z } from "zod";
import { PAYMENT_METHOD } from "./payment.contant";

export const createPaymentSchema = z.object({
    orderId: z.string().optional(),
    packageId: z.string().optional(),
    method: z.nativeEnum(PAYMENT_METHOD),
    amount: z.number().min(0, "Số tiền không được âm"),
});