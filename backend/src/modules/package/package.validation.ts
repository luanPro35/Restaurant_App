import { z } from "zod";

export const createPackageSchema = z.object({
    name: z.string(),
    address: z.string(),
    description: z.string().optional().nullable(),
    price: z.number(),
    status: z.string().optional(),
    paymentMethod: z.string().optional(),
    userId: z.string().optional().nullable(),
});

export const updatePackageSchema = z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    description: z.string().optional().nullable(),
    price: z.number().optional(),
    status: z.string().optional(),
    paymentMethod: z.string().optional(),
    userId: z.string().optional().nullable(),
});

export const deletePackageSchema = z.object({
    id: z.string(),
});