import { Role } from "@prisma/client";
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string().min(8).max(10),
  role: z.nativeEnum(Role),
})

export const registerUserSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string().min(8).max(10),
})

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type CreateUserDTO = z.infer<typeof createUserSchema> 
export type RegisterUserDTO = z.infer<typeof registerUserSchema> 
export type AuthenticateUserDTO = z.infer<typeof loginUserSchema> 