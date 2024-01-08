import { ReactQueryOptions, RouterInputs, trpc } from "@client/services/trpc";

type LinkByIdOptions = ReactQueryOptions["link"]["byId"];
type LinkByIdInput = RouterInputs["link"]["byId"];

export function useLinkById(input: LinkByIdInput, options?: LinkByIdOptions) {
  return trpc.link.byId.useQuery(input, options);
}
