"use client";

import Link from "next/link";
import {
  Typography,
  typographyVariants,
} from "@client/components/ui/base/Typography";
import { trpc } from "@client/lib/trpc";

// const async Home = () => {
const Home = () => {
  // const { greeting } = await trpc.hello.query({ name: `Tom` });
  const helloQuery = trpc.hello.useQuery({ name: `Tom` });
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
        <Typography variant="h6">{helloQuery.data?.greeting}</Typography>
      </div>
    </main>
  );
};

export default Home;
