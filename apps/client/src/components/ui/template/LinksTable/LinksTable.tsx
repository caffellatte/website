import { useEffect, useState, useMemo } from "react";
import { useLinksAnalyze } from "@client/services/hooks/useLinksAnalyze";
import { trpc } from "@client/services/trpc";

const LinksTable = () => {
  const [links, setLinks] = useState<
    | { title: string; description: string; url: string; id: number }[]
    | undefined
  >();

  const linkAnalyze = useLinksAnalyze();
  // const links = useLinksFindAll();
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

  const handleLinksAnalyze = () => {
    linkAnalyze.mutate({
      type: "reports",
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        {links &&
          links.map(({ id }) => (
            <li className="flex items-center" key={id}>
              {id}{" "}
              <button
                onClick={handleLinksAnalyze}
                disabled={linkAnalyze.isPending}
              >
                Analyze links
              </button>
            </li>
          ))}
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
  );
};

export default LinksTable;
