import { TableStatus } from "@prisma/client";
import { z } from "zod";

export const getTablesSchema = z.object({
  status: z.nativeEnum(TableStatus).optional(),
  location: z.string().optional(),
});

export const createTableSchema = z.object({
  name: z.string().min(2, "Tên bàn quá ngắn"),
  capacity: z.number().min(1, "Số chỗ ngồi phải lớn hơn 0"),
  status: z.nativeEnum(TableStatus).optional(),
  location: z.string().optional(),
});

export const updateTableSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(2, "Tên bàn quá ngắn").optional(),
  capacity: z.number().min(1, "Số chỗ ngồi phải lớn hơn 0").optional(),
  status: z.nativeEnum(TableStatus).optional(),
  location: z.string().optional(),
});

export const deleteTableSchema = z.object({
  id: z.coerce.number(),
});

export const getTableByIdSchema = z.object({
  id: z.coerce.number(),
});
