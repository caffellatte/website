import Cookies from "js-cookie";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@server/trpc/trpc.router";
import { createTRPCClient } from "@trpc/react-query";

export const trcpProxyClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:4000/trpc",
    }),
  ],
});

export async function handleTrpcUnauthError(
  res: Response,
  url: RequestInfo | URL,
  options: any,
) {
  const data = await res.json();
  const error = data.error
    ? data.error
    : data[0].error; /* Todo: map data array */
  const refreshToken = Cookies.get("refresh_token");
  if (error.message === "jwt expired" && refreshToken) {
    try {
      const refreshResponse = await trcpProxyClient.auth.refresh.query({
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token, user_id } = refreshResponse;
      Cookies.set("access_token", access_token, { expires: 7 });
      Cookies.set("refresh_token", refresh_token, { expires: 7 });
      Cookies.set("user_id", user_id.toString(), { expires: 7 });

      const { Authorization, ...headers } = options.headers;

      return await fetch(url, {
        ...options,
        headers: {
          ...headers,
          authorization: access_token,
        },
      });
    } catch (error) {
      // Todo: navigate to login
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.remove("user_id");
      return res;
    }
  } else {
    return await fetch(url, options);
  }
}
