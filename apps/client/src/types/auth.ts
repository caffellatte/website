import { z } from "zod";

/**
 * Register
 */

export const registerSchema = z.object({
  username: z
    .string()
    .min(4, { message: "This field is required (min 4 characters)" }),
  // .email("Invalid email"),
  password: z
    .string()
    .min(8, { message: "This field is required (min 8 characters)" }),
});

export type RegisterFormSchema = z.infer<typeof registerSchema> & {
  registerError: string;
};

/**
 * Login
 */

export const loginSchema = z.object({
  username: z
    .string()
    .min(4, { message: "This field is required (min 4 characters)" }),
  // .email("Invalid email"),
  password: z
    .string()
    .min(8, { message: "This field is required (min 8 characters)" }),
});

export type LoginFormSchema = z.infer<typeof loginSchema> & {
  loginError: string;
};
