import {
  trpc,
  type ReactQueryOptions,
  type RouterInputs,
  type RouterOutputs,
} from "@client/services/trpc";

type LinksAnalyzeOptions = ReactQueryOptions["linksAnalyze"];

export function useLinksAnalyze(options?: LinksAnalyzeOptions) {
  const utils = trpc.useUtils();

  return trpc.linksAnalyze.useMutation({
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
