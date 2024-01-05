import Link from "next/link";
import {
  Typography,
  typographyVariants,
} from "@/components/ui/base/Typography";

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <div className="flex flex-col gap-3 text-center">
        <Typography variant="h4">Mikhail Lutsenko</Typography>
        <Typography variant="h6">Full-Stack Web Developer</Typography>
        <Link
          href="https://github.com/caffellatte"
          className={typographyVariants({ variant: "link" })}
        >
          github.com/caffellatte
        </Link>
      </div>
    </main>
  );
};

export default Home;
