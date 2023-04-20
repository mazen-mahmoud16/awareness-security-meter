import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { me } from "./api/auth";
import { trpc } from "./api/trpc";
import useRouter from "./router";
import { useThemeStore } from "./stores/theme";
import { userAtom } from "./stores/user";
import { httpBatchLink } from "@trpc/client";

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

const Main = () => {
  const [, setUser] = useAtom(userAtom);
  const theme = useThemeStore((t) => t.theme);
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
    <div className={`${theme === "dark" ? "dark" : ""}`}>
      <div className="text-black dark:bg-gray-900 dark:text-white min-h-screen">
        <RouterProvider router={router} />
      </div>
    </div>
  );
};

export default App;
