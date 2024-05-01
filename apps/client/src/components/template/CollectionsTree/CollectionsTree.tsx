// import { useEffect } from "react";
import { useCollectionsFindTrees } from "@client/services/hooks/useCollectionsFindTrees";
import { trpcBroker } from "@client/services/trpc";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Typography } from "@client/components/ui/typography";

const CollectionsTree = () => {
  const [parent] = useAutoAnimate();

  const collection = useCollectionsFindTrees();
  console.log(collection);

  trpcBroker.update.useSubscription(
    { type: "collections" },
    {
      onStarted() {
        console.log("Started collections subscription");
      },
      onData(data) {
        console.log(data);
      },
    },
  );

  return (
    <div ref={parent}>
      <Typography variant="code">
        {JSON.stringify(collection.data, null, 2)}
      </Typography>
    </div>
  );
};

export default CollectionsTree;
