"use client";

import React from "react";
import Cookies from "js-cookie";
import { useState } from "react";
import { handleTrpcUnauthError } from "./utils";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "@client/services/trpc";
import { createWSClient, wsLink, splitLink } from "@trpc/client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
// -

import { Provider } from "jotai/react";

const wsClient = createWSClient({
  url: `ws://localhost:4000/trpc`,
});

function Providers({ children }: React.PropsWithChildren) {
  const [queryClient] = React.useState(
    new QueryClient({
      // defaultOptions: {
      //   queries: {
      //     // staleTime: Infinity,
      //     // refetchOnMount: false,
      //     // refetchOnWindowFocus: false,
      //   },
      // },
    }),
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        splitLink({
          condition(op) {
            return op.type === "subscription";
          },
          true: wsLink({
            client: wsClient,
          }),
          false: httpBatchLink({
            url: "http://localhost:4000/trpc",
            // ?
            // fetch(url, options) {
            //   return fetch(url, {
            //     ...options,
            //     credentials: "include",
            //   });
            // },
            // ?
            // You can pass any HTTP headers you wish here
            async headers() {
              return {
                Authorization: Cookies.get("access_token"),
              };
            },
            fetch: async (url, options): Promise<Response> => {
              const res = await fetch(url, options);
              if (res.status === 401) {
                return await handleTrpcUnauthError(res, url, options);
              }
              return res;
            },
          }),
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration>
          <Provider>{children}</Provider>
        </ReactQueryStreamedHydration>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default Providers;
