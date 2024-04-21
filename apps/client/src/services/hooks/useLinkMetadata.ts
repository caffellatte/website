import {
  trpc,
  type ReactQueryOptions,
  // type RouterInputs,
  // type RouterOutputs,
} from "@client/services/trpc";

type LinkMetadataOptions = ReactQueryOptions["hyperlinks"]["metadata"];

export function useLinkMetadata(options?: LinkMetadataOptions) {
  // const utils = trpc.useUtils();

  return trpc.hyperlinks.metadata.useMutation({
    ...options,
    onSuccess(data, variables, context) {
      // invalidate all queries on the link router
      // when a new link is created
      // utils.linkCreate.invalidate();
      // utils.linksFindAll.invalidate();
      // utils.invalidate();
      options?.onSuccess?.(data, variables, context);
    },
  });
}
