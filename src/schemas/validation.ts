import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6)
});

export const dataSchema = z.object({
  type: z.string(),
  level: z.enum(['low', 'medium', 'high']),
  description: z.string(),
  source: z.string()
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type DataSchema = z.infer<typeof dataSchema>; 