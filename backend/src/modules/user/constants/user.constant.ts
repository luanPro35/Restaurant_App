export const USER_ROLE = {
  USER: "USER",
  ADMIN: "ADMIN",
  STAFF: "STAFF",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
