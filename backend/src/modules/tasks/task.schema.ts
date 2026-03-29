import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(120),
    description: z.string().max(500).optional(),
    completed: z.boolean().optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(120).optional(),
    description: z.string().max(500).optional(),
    completed: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});
