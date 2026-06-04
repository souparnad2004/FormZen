import {z} from "zod";

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  role: z.enum(["admin", "user"]).default("user"),
  emailVerified: z.boolean(),
  profileImageUrl: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable()
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
  user: userSchema,
  token: z.string().optional(),
})

export type UserSchemaType = z.infer<typeof userSchema>;
export type RegisterSchemaType  = z.infer<typeof registerSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type AuthResponseSchemaType = z.infer<typeof authResponseSchema>;
