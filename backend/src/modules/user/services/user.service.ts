import { get } from "http";
import User from "./user.model";

export const userService = {
  getUserById: async (id: string) => {
    return await User.findById(id);
  },
  getUserByEmial: async (email: string) => {
    return await User.findOne({ email });
  },
};
