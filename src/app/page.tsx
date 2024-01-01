import Link from "next/link";
import { Typography } from "@/components/ui/base/Text";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <div className="flex flex-col gap-3 text-center">
        <Typography variant="h4">Mikhail Lutsenko</Typography>
        <Typography variant="h6">Full-Stack Web Developer</Typography>
        <Link
          href="https://github.com/caffellatte"
          className="underline underline-offset-2 hover:no-underline transition-all duration-200 ease-in-out"
        >
          github.com/caffellatte
        </Link>
      </div>
    </main>
  );
}
