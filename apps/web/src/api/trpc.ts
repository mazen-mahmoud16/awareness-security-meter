import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@turbo/api/src/trpc/routers/_app";
export const trpc = createTRPCReact<AppRouter>();
