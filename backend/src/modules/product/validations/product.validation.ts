import { z } from "zod";
import { PRODUCT_UNITS, SortOrder } from "../constants/product.constant";

export const createProductSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  description: z.string().optional(),
  price: z.number().min(0, "Giá sản phẩm không hợp lệ"),
  originalPrice: z.number().optional(),
  unit: z.enum(PRODUCT_UNITS as [string, ...string[]]).optional(),
  category: z.string().min(1, "Danh mục không được để trống"),
  image: z.string().optional(),
  isAvailable: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  variants: z
    .array(
      z.object({
        name: z.string().min(1, "Tên biến thể không được để trống"),
        price: z.number().min(0, "Giá biến thể không hợp lệ"),
      }),
    )
    .optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const getProductsSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  unit: z.enum(PRODUCT_UNITS as [string, ...string[]]).optional(),
  isAvailable: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  sortOrder: z.nativeEnum(SortOrder).optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export const getProductByIdSchema = z.object({
  id: z.string().min(1, "ID sản phẩm không được để trống"),
});

export const deleteProductSchema = z.object({
  id: z.string().min(1, "ID sản phẩm không được để trống"),
});

export const toggleAvailabilitySchema = z.object({
  id: z.string().min(1, "ID sản phẩm không được để trống"),
  isAvailable: z.boolean(),
});
