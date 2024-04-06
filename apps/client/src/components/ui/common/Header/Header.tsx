import { buttonVariants } from "@client/components/ui/base/Button";
import { typographyVariants } from "@client/components/ui/base/Typography";
import { cn } from "@client/lib/utils";
import Link from "next/link";

const Header = () => {
  return (
    <header className="flex items-center justify-between py-4 w-full">
      <Link href="/" className={cn(typographyVariants({ variant: "h5" }))}>
        website
      </Link>
      <div className="flex items-center justify-between gap-6">
        <Link
          className={cn(buttonVariants({ size: "none", variant: "link" }))}
          href="/login"
        >
          login
        </Link>
        <Link
          className={cn(buttonVariants({ size: "none", variant: "link" }))}
          href="/register"
        >
          register
        </Link>
      </div>
    </header>
  );
};

export default Header;
