import { z } from "zod";

/**
 * Create
 */

export const linkCreateSchema = z.object({
  title: z
    .string()
    .min(4, { message: "This field is required (min 4 characters)" }),
  // .email("Invalid email"),
  description: z
    .string()
    .min(4, { message: "This field is required (min 4 characters)" }),
  url: z
    .string()
    .min(4, { message: "This field is required (min 4 characters)" }),
});

export type LinkCreateFormSchema = z.infer<typeof linkCreateSchema> & {
  linkCreateError: string;
};

/**
 * Metadata
 */

export const linkMetadataSchema = z.object({
  url: z
    .string()
    .min(4, { message: "This field is required (min 4 characters)" }),
});

export type LinkMetadataFormSchema = z.infer<typeof linkMetadataSchema> & {
  linkMetadataError: string;
};
