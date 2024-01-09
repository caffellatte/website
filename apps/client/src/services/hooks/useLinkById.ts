import { ReactQueryOptions, RouterInputs, trpc } from "@client/services/trpc";

type LinkByIdOptions = ReactQueryOptions["link"];
type LinkByIdInput = RouterInputs["link"];

export function useLinkById(input: LinkByIdInput, options?: LinkByIdOptions) {
  return trpc.link.byId.useQuery(input, options);
}
