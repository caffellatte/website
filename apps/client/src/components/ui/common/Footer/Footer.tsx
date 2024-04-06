import { typographyVariants } from "@client/components/ui/base/Typography";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="py-4">
      <Link
        href="https://github.com/caffellatte/website"
        className={typographyVariants({ variant: "link" })}
      >
        github.com/caffellatte/website
      </Link>
    </footer>
  );
};

export default Footer;
