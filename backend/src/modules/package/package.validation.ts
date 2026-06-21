import { z } from "zod";
import { PackageStatus } from "./package.contant";

export const createPackageSchema = z.object({
    name: z.string(),
    address: z.string(),
    description: z.string(),
    price: z.number(),
    status: z.enum([PackageStatus.PENDING, PackageStatus.CONFIRMED, PackageStatus.CANCELED]),
    paymentMethod: z.string(),
});

export const updatePackageSchema = createPackageSchema.partial();

export const deletePackageSchema = z.object({
    id: z.string(),
});