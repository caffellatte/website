import { ReactQueryOptions, RouterInputs, trpc } from "@client/services/trpc";

type LinkByIdOptions = ReactQueryOptions["linkFindById"];
type LinkByIdInput = RouterInputs["linkFindById"];

export function useLinkFindById(
  input: LinkByIdInput,
  options?: LinkByIdOptions
) {
  return trpc.linkFindById.useQuery(input, options);
}
