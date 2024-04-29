import { buttonVariants } from "@client/components/ui/button";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="py-4">
      <Link
        href="https://github.com/caffellatte/website"
        className={buttonVariants({ variant: "link" })}
      >
        github.com/caffellatte/website
      </Link>
    </footer>
  );
};

export default Footer;
