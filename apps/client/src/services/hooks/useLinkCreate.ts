import {
  trpc,
  type ReactQueryOptions,
  type RouterInputs,
  type RouterOutputs,
} from "@client/services/trpc";

type LinkCreateOptions = ReactQueryOptions["linkCreate"];

export function useLinkCreate(options?: LinkCreateOptions) {
  const utils = trpc.useUtils();

  return trpc.linkCreate.useMutation({
    ...options,
    onSuccess(title, description, url) {
      // invalidate all queries on the link router
      // when a new link is created
      // utils.linkCreate.invalidate();
      options?.onSuccess?.(title, description, url);
    },
  });
}
