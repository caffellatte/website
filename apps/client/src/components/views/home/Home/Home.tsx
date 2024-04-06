"use client";

import {
  Typography,
  typographyVariants,
} from "@client/components/ui/base/Typography";
import { useLinkCreate } from "@client/services/hooks/useLinkCreate";
import { useLinkFindById } from "@client/services/hooks/useLinkFindById";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
// import { useLinksFindAll } from "@client/services/hooks/useLinksFindAll";
import { useLinksAnalyze } from "@client/services/hooks/useLinksAnalyze";
import { trpc } from "@client/services/trpc";
import { Button, buttonVariants } from "@client/components/ui/base/Button";
import { Input } from "@client/components/ui/base/Input";
import { cn } from "@client/lib/utils";
import { size } from "@client/app/icon";

const Home = () => {
  const [links, setLinks] = useState<
    | { title: string; description: string; url: string; id: number }[]
    | undefined
  >();
  const linkCreate = useLinkCreate();
  const linkAnalyze = useLinksAnalyze();
  // const links = useLinksFindAll();
  const link = useLinkFindById({ id: 1 });
  const utils = trpc.useUtils();
  const infiniteLinks = trpc.hyperlinks.get.useInfiniteQuery(
    {
      limit: 5,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      // initialCursor: 1, // <-- optional you can pass an initialCursor
    },
  );

  const totalLinks = useMemo(() => {
    const total = infiniteLinks.data?.pages.at(0)?.total;
    if (total) return total;
    return 0;
  }, [infiniteLinks.data?.pages]);

  useEffect(() => {
    const arrays = infiniteLinks.data?.pages.map((page) => page.links);
    const result = arrays?.reduce(
      (accumulator, links) => [...accumulator, ...links],
      [],
    );
    setLinks(result);
  }, [infiniteLinks.data?.pages]);

  trpc.update.useSubscription(
    { type: "links" },
    {
      onStarted() {
        console.log("Started update subscription");
      },
      onData(data) {
        console.log(data);
        utils.hyperlinks.get.invalidate();
      },
    },
  );

  trpc.update.useSubscription(
    { type: "reports" },
    {
      onStarted() {
        console.log("Started reports subscription");
      },
      onData(data) {
        console.log(data);
        utils.hyperlinks.get.invalidate();
      },
    },
  );

  const handleLinkCreate = () => {
    linkCreate.mutate({
      title: "Title",
      description: "Description",
      url: "URL",
    });
  };

  const handleLinksAnalyze = () => {
    linkAnalyze.mutate({
      type: "reports",
    });
  };

  return (
    <main className="container flex min-h-screen flex-col items-center justify-between">
      <header className="flex items-center justify-between py-5 w-full">
        <Typography variant="h5">website</Typography>
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
      <div className="flex flex-col gap-3 text-center">
        <Button onClick={handleLinkCreate} disabled={linkCreate.isPending}>
          Create link
        </Button>
        <button onClick={handleLinksAnalyze} disabled={linkCreate.isPending}>
          Analyze links
        </button>
        <div className="flex flex-col gap-2">
          {links && links.map(({ id }) => <li key={id}>{id}</li>)}
        </div>
        {links && links?.length !== 0 && totalLinks > links?.length && (
          <button
            onClick={() => {
              infiniteLinks.fetchNextPage();
            }}
            disabled={infiniteLinks.isLoading}
          >
            Fetch Next Page
          </button>
        )}
      </div>
      <footer className="py-5">
        <Link
          href="https://github.com/caffellatte/website"
          className={typographyVariants({ variant: "link" })}
        >
          github.com/caffellatte/website
        </Link>
      </footer>
    </main>
  );
};

export default Home;
