import {z} from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email("Invalid email"),
  email_verified: z.boolean(),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const authResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.email(),
    name: z.string(),
    email_verified: z.boolean(),
  }),
  token: z.string().optional(),
})

export type UserSchemaType = z.infer<typeof userSchema>;
export type RegisterSchemaType  = z.infer<typeof registerSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type AuthResponseSchemaType = z.infer<typeof authResponseSchema>;