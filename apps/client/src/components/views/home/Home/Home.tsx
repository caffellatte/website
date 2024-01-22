"use client";

import Link from "next/link";
import {
  Typography,
  typographyVariants,
} from "@client/components/ui/base/Typography";
import { useLinkCreate } from "@client/services/hooks/useLinkCreate";
import { useLinkFindById } from "@client/services/hooks/useLinkFindById";
import { useLinksFindAll } from "@client/services/hooks/useLinksFindAll";
import { useLinksAnalyze } from "@client/services/hooks/useLinksAnalyze";
import { trpc } from "@client/services/trpc";

const Home = () => {
  const linkCreate = useLinkCreate();
  const linkAnalyze = useLinksAnalyze();
  const links = useLinksFindAll();
  const link = useLinkFindById({ id: 1 });

  trpc.randomNumber.useSubscription(
    { odd: true },
    {
      onStarted() {
        console.log("Started randomNumber subscription");
      },
      onData(data) {
        console.log(data);
      },
    }
  );

  console.log(link.data?.link);
  console.log(links.data?.links);

  const handleLinkCreate = () => {
    linkCreate.mutate({
      title: "Title",
      description: "Description",
      url: "URL",
    });
  };

  const handleLinksAnalyze = () => {
    linkAnalyze.mutate({
      type: "test",
    });
  };
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
        <button onClick={handleLinkCreate} disabled={linkCreate.isLoading}>
          Create link
        </button>
        <button onClick={handleLinksAnalyze} disabled={linkCreate.isLoading}>
          Analyze links
        </button>
      </div>
    </main>
  );
};

export default Home;
