import { z } from "zod";

export default {
  createAddress: {
    body: z.object({
      name: z
        .string()
        .min(3, "Tên người nhận phải có ít nhất 3 ký tự")
        .max(100),
      phone: z.string().min(10, "Số điện thoại không hợp lệ").max(15),
      address: z.string().min(10, "Vui lòng nhập địa chỉ đầy đủ").max(255),
      detail: z.string().optional().nullable(),
      type: z.enum(["HOME", "OFFICE", "OTHER"]).default("HOME"),
      isDefault: z.boolean().optional().default(false),
    }),
  },
  updateAddress: {
    params: z.object({
      id: z.string().uuid("ID địa chỉ không hợp lệ"),
    }),
    body: z.object({
      name: z.string().min(3).max(100).optional(),
      phone: z.string().min(10).max(15).optional(),
      address: z.string().min(10).max(255).optional(),
      detail: z.string().optional().nullable(),
      type: z.enum(["HOME", "OFFICE", "OTHER"]).optional(),
      isDefault: z.boolean().optional(),
    }),
  },
  getAddress: {
    params: z.object({
      id: z.string().uuid("ID địa chỉ không hợp lệ"),
    }),
  },
  deleteAddress: {
    params: z.object({
      id: z.string().uuid("ID địa chỉ không hợp lệ"),
    }),
  },
};
