import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";
import AdminModel from "../models/admin";
import UserModel from "../models/user";
import { Context } from "./context";

declare module "express-session" {
  export interface Session {
    user: string;
    admin: string;
  }
}

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.issues
            : null,
      },
    };
  },
});

/**
 * Create a router
 * @see https://trpc.io/docs/v10/router
 */
export const router = t.router;

/**
 * Create an unprotected procedure
 * @see https://trpc.io/docs/v10/procedures
 **/
export const publicProcedure = t.procedure;

/**
 * @see https://trpc.io/docs/v10/middlewares
 */
export const middleware = t.middleware;

/**
 * @see https://trpc.io/docs/v10/merging-routers
 */
export const mergeRouters = t.mergeRouters;

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = await UserModel.findById(ctx.session.user).select("-password");

  if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

  return next({
    ctx: {
      session: { ...ctx.session, user },
    },
  });
});

const isAdmin = middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.admin) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = await AdminModel.findById(ctx.session.admin).select("-password");

  if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

  return next({
    ctx: {
      session: { ...ctx.session, user },
    },
  });
});

/**
 * Protected procedure
 **/
export const userProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(isAdmin);
