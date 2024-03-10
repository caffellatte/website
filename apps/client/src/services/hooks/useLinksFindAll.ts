import { ReactQueryOptions, RouterInputs, trpc } from "@client/services/trpc";

type LinkByIdOptions = ReactQueryOptions["hyperlinks"]["findAll"];
type LinkByIdInput = RouterInputs["hyperlinks"]["findAll"];

export function useLinksFindAll(
  input: LinkByIdInput,
  options?: LinkByIdOptions,
) {
  return trpc.hyperlinks.findAll.useQuery(input, options);
}
