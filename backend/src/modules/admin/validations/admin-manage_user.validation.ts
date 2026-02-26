import z from "zod";
import { USER_ROLE } from "../../user/constants/user.constant";

const getUsers = {
  query: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    role: z.nativeEnum(USER_ROLE).optional(),
    limit: z.string().optional().transform(Number),
    page: z.string().optional().transform(Number),
  }),
};

const createUser = {
  body: z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(8, "Password phải ít nhất 8 ký tự"),
    name: z.string().min(2, "Tên quá ngắn"),
    phone: z.string().optional(),
    role: z.nativeEnum(USER_ROLE),
  }),
};

const updateUser = {
  body: z.object({
    name: z.string().min(2, "Tên quá ngắn").optional(),
    phone: z.string().optional(),
    role: z.nativeEnum(USER_ROLE).optional(),
  }),
};

export default {
  getUsers,
  createUser,
  updateUser,
};
