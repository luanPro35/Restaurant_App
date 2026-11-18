import { z } from "zod";
import { PackageStatus } from "@prisma/client";

export const createPackageSchema = z.object({
    note: z.string().trim().max(500).optional(),
    name: z.string(),
    address: z.string(),
    description: z.string().optional().nullable(),
    price: z.number(),
    status: z.nativeEnum(PackageStatus).optional(),
    paymentMethod: z.string().optional(),
    userId: z.string().optional().nullable(),
});

export const updatePackageSchema = z.object({
    note: z.string().trim().max(500).optional(),
    name: z.string().optional(),
    address: z.string().optional(),
    description: z.string().optional().nullable(),
    price: z.number().optional(),
    status: z.nativeEnum(PackageStatus).optional(),
    paymentMethod: z.string().optional(),
    userId: z.string().optional().nullable(),
});

export const deletePackageSchema = z.object({
    id: z.string(),
});