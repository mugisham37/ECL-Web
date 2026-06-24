"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const ReactQueryDevtools = dynamic(
  () =>
    import("@tanstack/react-query-devtools").then((m) => m.ReactQueryDevtools),
  { ssr: false },
);

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" &&
        process.env.NEXT_PUBLIC_RQ_DEVTOOLS === "1" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
    </QueryClientProvider>
  );
}
