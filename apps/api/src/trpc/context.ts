import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import logger from "../lib/logger";
import AdminModel from "../models/admin";
import TenantModel from "../models/tenant";
import TenantAuthModel from "../models/tenant/tenant-auth";
import UserModel from "../models/user";

export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  session: req.session,
  logger: logger,
});

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
