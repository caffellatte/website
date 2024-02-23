import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";

import { cn } from "@client/lib/utils";
import { forwardRef, HTMLAttributes } from "react";

const variants = {
  h1: "h1",
  h2: "h2",
  h3: "h2",
  h4: "h2",
  h5: "h2",
  h6: "h2",
  subheading1: "h6",
  subheading2: "h6",
  body1: "p",
  body2: "p",
  link: "span",
};

const typographyStyleVariants = {
  h1: "text-6xl",
  h2: "text-5xl",
  h3: "text-4xl",
  h4: "text-3xl",
  h5: "text-2xl",
  h6: "text-1xl",
  subheading1: "text-1xl font-bold",
  subheading2: "text-1xl font-semibold",
  body1: "text-base",
  body2: "text-base font-bold",
  link: "underline underline-offset-2 hover:no-underline transition duration-200 ease-in-out",
};

const typographyVariants = cva("text-base font-normal", {
  variants: {
    variant: typographyStyleVariants,
    color: {
      primary: "text-primary",
      secondary: "text-secondary-foreground",
      main: "text-foreground",
      accent: "text-accent",
      white: "text-white",
      error: "text-error",
    },
  },
  defaultVariants: {
    variant: "body1",
    color: "main",
  },
});

interface TypographyProps
  extends Omit<
      HTMLAttributes<
        HTMLParagraphElement | HTMLHeadingElement | HTMLSpanElement
      >,
      "color"
    >,
    VariantProps<typeof typographyVariants> {
  asChild?: boolean;
}

const Typography = forwardRef<
  HTMLParagraphElement | HTMLHeadingElement,
  TypographyProps
>(({ className, variant, color, asChild = false, ...props }, ref) => {
  const Component = asChild ? Slot : variant ? variants[variant] : "p";
  return (
    <Component
      className={cn(typographyVariants({ variant, color, className }))}
      ref={ref}
      {...props}
    />
  );
});

Typography.displayName = "Typography";

export { Typography, type TypographyProps, typographyVariants };
