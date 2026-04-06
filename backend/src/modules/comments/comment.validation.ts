import { z } from "zod";

export const createCommentSchema = z.object({
    userId: z.string().optional(),
    content: z.string().optional(),
    imageUrl: z.string().optional(),
});

export const updateCommentSchema = z.object({
    userId: z.string().optional(),
    content: z.string().optional(),
    imageUrl: z.string().optional(),
});

export const deleteCommentSchema = z.object({
    id: z.string().optional(),
});
