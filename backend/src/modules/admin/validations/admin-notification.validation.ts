import { z } from "zod";

export const GetNotificationsSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  limit: z.number().optional(),
  page: z.number().optional(),
  search: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  isActive: z.boolean().optional(),
});

export const CreateNotificationSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  content: z.string(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
});

export const UpdateNotificationSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
});

export const DeleteNotificationSchema = z.object({
  id: z.string(),
});
