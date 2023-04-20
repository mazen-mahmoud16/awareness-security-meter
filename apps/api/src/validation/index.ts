import { z } from "zod";

export const skipLimitSchema = (skip = 50, limit = 50) =>
  z.object({
    skip: z.number().positive().max(skip).optional(),
    limit: z.number().positive().max(limit).optional(),
  });

export const PaginationSchema = z.object({
  skip: z.number().min(0),
  take: z.number().min(0),
  search: z.string().optional(),
});

export const WhoAmISchema = z.object({ email: z.string() });
