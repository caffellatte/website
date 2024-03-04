import Cookies from "js-cookie";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@server/trpc/trpc.router";
import { createTRPCProxyClient } from "@trpc/react-query";

export const trcpProxyClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:4000/trpc",
    }),
  ],
});

export async function handleTrpcUnauthError(
  res: Response,
  url: RequestInfo | URL,
  options: any
) {
  const { error } = await res.json();
  const refreshToken = Cookies.get("refresh_token");
  if (error.message === "jwt expired" && refreshToken) {
    try {
      const refreshResponse = await trcpProxyClient.refresh.query({
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token } = refreshResponse;
      Cookies.set("access_token", access_token);
      Cookies.set("refresh_token", refresh_token);

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
      return res;
    }
  }

  return res;
}
