import {
  trpc,
  type ReactQueryOptions,
  type RouterInputs,
  type RouterOutputs,
} from "@client/services/trpc";
import Cookies from "js-cookie";

type RegisterOptions = ReactQueryOptions["auth"]["register"];

export function useRegister(options?: RegisterOptions) {
  const utils = trpc.useUtils();

  return trpc.auth.register.useMutation({
    ...options,
    onSuccess(data, variables, context) {
      // invalidate all queries on the link router
      // when a new link is created
      // utils.linkCreate.invalidate();
      // utils.linksFindAll.invalidate();
      if (data?.access_token && data?.refresh_token && data?.user_id) {
        Cookies.set("access_token", data.access_token, { expires: 7 });
        Cookies.set("refresh_token", data.refresh_token, { expires: 7 });
        Cookies.set("user_id", data.user_id.toString(), { expires: 7 });
      }
      utils.invalidate();
      options?.onSuccess?.(data, variables, context);
    },
  });
}
