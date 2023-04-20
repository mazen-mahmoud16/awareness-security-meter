/**
 * This file contains the root router of your tRPC-backend
 */
import { userRouter } from "./user";
import { publicProcedure, router } from "../trpc";
import { adminRouter } from "./admin";

export const appRouter = router({
  user: userRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
