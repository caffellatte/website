import { z } from "zod";

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
