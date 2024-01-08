import {
  trpc,
  type ReactQueryOptions,
  type RouterInputs,
  type RouterOutputs,
} from "@client/services/trpc";

type LinkCreateOptions = ReactQueryOptions["link"]["create"];

export function useLinkCreate(options?: LinkCreateOptions) {
  const utils = trpc.useUtils();

  return trpc.link.create.useMutation({
    ...options,
    onSuccess(link) {
      // invalidate all queries on the link router
      // when a new link is created
      utils.link.invalidate();
      options?.onSuccess?.(link);
    },
  });
}
