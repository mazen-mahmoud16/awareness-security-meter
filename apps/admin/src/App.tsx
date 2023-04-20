import { RouterProvider } from "react-router-dom";
import { userAtom } from "./atoms/user";
import { useAtom } from "jotai";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { me } from "./api/auth";
import { trpc } from "./api/trpc";
import useRouter from "./router";

export const App = () => {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
        }),
      ],
    })
  );
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Main />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export const Main = () => {
  const [, setUser] = useAtom(userAtom);

  const router = useRouter();

  useQuery(["user-auth"], me, {
    onSuccess(data) {
      setUser({ loading: false, user: data?.result });
    },
    onError(err) {
      setUser({ loading: false });
    },
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
