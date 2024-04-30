import { z } from "zod";

/**
 * Create
 */

export const collectionCreateSchema = z.object({
  title: z
    .string()
    .min(4, { message: "This field is required (min 4 characters)" }),
  // .email("Invalid email"),
  description: z
    .string()
    .min(4, { message: "This field is required (min 4 characters)" }),
  path: z
    .string()
    .min(4, { message: "This field is required (min 4 characters)" }),
});

export type CollectionCreateFormSchema = z.infer<
  typeof collectionCreateSchema
> & {
  collectionCreateError: string;
};
