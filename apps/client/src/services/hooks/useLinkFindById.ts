import { ReactQueryOptions, RouterInputs, trpc } from "@client/services/trpc";

type LinkByIdOptions = ReactQueryOptions["hyperlinks"]["findById"];
type LinkByIdInput = RouterInputs["hyperlinks"]["findById"];

export function useLinkFindById(
  input: LinkByIdInput,
  options?: LinkByIdOptions,
) {
  return trpc.hyperlinks.findById.useQuery(input, options);
}
