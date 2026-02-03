import z from "zod";
// import { password, objectId } from './custom.validation';

const passwordSchema = z
  .string()
  .min(8, "Password phải ít nhất 8 ký tự")
  .regex(/[A-Z]/, "Password phải có ít nhất 1 chữ hoa")
  .regex(/[a-z]/, "Password phải có ít nhất 1 chữ thường")
  .regex(/[0-9]/, "Password phải có ít nhất 1 số");

const createUser = {
  body: z
    .object({
      email: z.string().trim().email(),
      password: passwordSchema,
      name: z.string().trim().min(2, "Tên quá ngắn").max(50, "Tên quá dài"),
      role: z.enum(["user", "admin", "staff"]),
    })
    .strict(),
};

export default {
  createUser,
};
