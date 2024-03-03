import {
  trpc,
  type ReactQueryOptions,
  type RouterInputs,
  type RouterOutputs,
} from "@client/services/trpc";
import Cookies from "js-cookie";

type LoginOptions = ReactQueryOptions["login"];

export function useLogin(options?: LoginOptions) {
  const utils = trpc.useUtils();

  return trpc.login.useMutation({
    ...options,
    onSuccess(data, variables, context) {
      // invalidate all queries on the link router
      // when a new link is created
      // utils.linkCreate.invalidate();
      // utils.linksFindAll.invalidate();
      if (data?.access_token && data?.refresh_token) {
        Cookies.set("access_token", data.access_token, { expires: 7 });
        Cookies.set("refresh_token", data.refresh_token, { expires: 7 });
      }
      utils.invalidate();
      options?.onSuccess?.(data, variables, context);
    },
  });
}
