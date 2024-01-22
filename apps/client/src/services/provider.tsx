"use client";

import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "@client/services/trpc";
import { useState } from "react";
import { createWSClient, wsLink, splitLink } from "@trpc/client";

const wsClient = createWSClient({
  url: `ws://localhost:4000`,
});

function Providers({ children }: React.PropsWithChildren) {
  const [queryClient] = React.useState(new QueryClient());
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
            // You can pass any HTTP headers you wish here
            // async headers() {
            //     return {
            //         ...headers
            //     };
            // },
          }),
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default Providers;
