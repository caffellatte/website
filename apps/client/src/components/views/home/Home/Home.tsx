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
  }, [infiniteLinks.data?.pages?.at(0)?.total]);

  console.log(infiniteLinks.data);

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

  console.log(link.data?.link);

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
        <button onClick={handleLinkCreate} disabled={linkCreate.isPending}>
          Create link
        </button>
        <button onClick={handleLinksAnalyze} disabled={linkCreate.isPending}>
          Analyze links
        </button>
        <div className="flex flex-col gap-2">
          {links && links.map(({ id }) => <li key={id}>{id}</li>)}
        </div>
        {links?.length && totalLinks > links?.length && (
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
    </main>
  );
};

export default Home;
