import {
  trpc,
  type ReactQueryOptions,
  type RouterInputs,
  type RouterOutputs,
} from "@client/services/trpc";

type LinkCreateOptions = ReactQueryOptions["hyperlinks"]["create"];

export function useLinkCreate(options?: LinkCreateOptions) {
  const utils = trpc.useUtils();

  return trpc.hyperlinks.create.useMutation({
    ...options,
    onSuccess(data, variables, context) {
      // invalidate all queries on the link router
      // when a new link is created
      // utils.linkCreate.invalidate();
      // utils.linksFindAll.invalidate();
      utils.invalidate();
      options?.onSuccess?.(data, variables, context);
    },
  });
}
