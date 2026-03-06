import { z } from "zod";
import { ORDER_STATUS } from "./order.contant";
const productItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  note: z.string().optional(),
});

export const createOrderSchema = z.object({
  tableId: z.string().min(1, "Table ID is required"),
  items: z
    .array(productItemSchema)
    .min(1, "Order must contain at least one item"),
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(ORDER_STATUS),
});

export const addItemsToOrderSchema = z.object({
  items: z.array(productItemSchema).min(1, "Must add at least one item"),
});
