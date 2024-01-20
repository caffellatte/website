import { ReactQueryOptions, RouterInputs, trpc } from "@client/services/trpc";

type LinkByIdOptions = ReactQueryOptions["linksFindAll"];
type LinkByIdInput = RouterInputs["linksFindAll"];

export function useLinksFindAll(
  input: LinkByIdInput,
  options?: LinkByIdOptions
) {
  return trpc.linksFindAll.useQuery(input, options);
}
