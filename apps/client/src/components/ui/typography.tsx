import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";

import { cn } from "@client/lib/utils";
import { forwardRef, HTMLAttributes } from "react";

const variants = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  p: "p",
  blockquote: "p",
  inlinecode: "code",
  lead: "p",
  large: "div",
  small: "small",
  muted: "p",
  link: "span",
};

const typographyStyleVariants = {
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  p: "leading-7 [&:not(:first-child)]:mt-6",
  blockquote: "mt-6 border-l-2 pl-6 italic",
  inlinecode:
    "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
  lead: "text-xl text-muted-foreground",
  large: "text-lg font-semibold",
  small: "text-sm font-medium leading-none",
  muted: "text-sm text-muted-foreground",
  link: "font-medium text-primary underline underline-offset-4",
};

const typographyVariants = cva("text-base font-normal", {
  variants: {
    variant: typographyStyleVariants,
    color: {
      default: "",
      error: "text-destructive",
    },
  },
  defaultVariants: {
    variant: "p",
    color: "default",
  },
});

interface TypographyProps
  extends Omit<
      HTMLAttributes<
        | HTMLParagraphElement
        | HTMLHeadingElement
        | HTMLSpanElement
        | HTMLDivElement
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
