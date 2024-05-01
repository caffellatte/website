import { ReactQueryOptions, RouterInputs, trpc } from "@client/services/trpc";

type CollectionsFindTreesOptions =
  ReactQueryOptions["collections"]["findTrees"];
type CollectionsFindTreesInput = RouterInputs["collections"]["findTrees"];

export function useCollectionsFindTrees(
  input: CollectionsFindTreesInput,
  options?: CollectionsFindTreesOptions,
) {
  return trpc.collections.findTrees.useQuery(input, options);
}
