// https://stackoverflow.com/questions/73554477/typescript-error-with-custom-typography-component
import clsx from "clsx";

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
  link: "p",
} as const;

const typographyVariants = {
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
  link: "text-xs text-primaryViolet uppercase underline font-bold",
};

export type TypographyProps = {
  variant?: keyof typeof variants;
  className?: string;
  children: React.ReactNode | string;
};

export const Typography = ({
  variant = "body1",
  className,
  children,
}: TypographyProps) => {
  const Component = variants[variant];
  const typographyStyles = typographyVariants[variant];

  return (
    <Component className={clsx("font-sans", typographyStyles, className)}>
      {children}
    </Component>
  );
};
