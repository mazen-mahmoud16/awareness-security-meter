import { NextFunction, Request, RequestHandler, Response } from "express";
import { CALLBACK_CLIENT_URL, FAILURE_CLIENT_URL } from "../../lib/constants";
import { RedirectError } from "../../lib/error/RedirectError";

import "../strategies/google";
import "../strategies/microsoft";
import "../strategies/microsoft-saml";

import { HttpError } from "../../lib/error/HttpError";
import asyncHandler from "../../lib/middlewares/asyncHandler";
import { Tenant } from "../../models/tenant";
import UserModel, { User } from "../../models/user";
import logger from "../../lib/logger";
import { TenantAuth } from "../../models/tenant/tenant-auth";

export const whoami: RequestHandler = asyncHandler(async (req, res) => {
  const user = await UserModel.findOne({
    email: new RegExp(req.body.email, "i"),
  })
    .populate<User & { tenant?: Tenant; provider?: TenantAuth }>("authProvider")
    .populate({ path: "tenant", populate: { path: "defaultProvider" } });

  if (!user) throw new HttpError(404, { email: "User Not Found" });
  if (user?.email.toLowerCase() !== req.body.email.toLowerCase())
    throw new HttpError(404, { email: "User Not Found" });

  if (!user.tenant)
    throw new HttpError(404, { email: "User Does Not Belong to Tenant" });

  const provider = (user.authProvider ?? user.tenant?.defaultProvider) as
    | TenantAuth
    | undefined;

  if (!provider)
    throw new HttpError(400, {
      email: "User Does Not Have Authentication Provider",
    });

  const type = provider.type;

  return res.json({
    code: 200,
    result: {
      redirect: `/api/auth/${type}/login?provider=${provider.id}&email=${user.email}`,
      isNew: type === "local" && !user.password,
      provider: type,
      email: user.email,
    },
  });
});

export const me: RequestHandler = asyncHandler((req, res) => {
  return res.json({ code: 200, result: req.user });
});

export const signOut: RequestHandler = asyncHandler((req, res) => {
  if (!req.session.admin) {
    req.session.destroy((err) => {
      res.cookie("sid", "none", {
        expires: new Date(),
        httpOnly: true,
      });
      if (err) {
        res.json({ code: 400, error: "Unable to Sign out" });
      } else {
        res.json({ code: 200, message: "Sucessfully Signed out" });
      }
    });
  } else if (req.session.user) {
    // @ts-ignore
    req.session.user = undefined;
    res.json({ code: 200, message: "Sucessfully Signed out" });
  } else {
    res.json({ code: 400, error: "Not Logged in" });
  }
  logger.info({
    message: `${req.user?.email} | User Logged Out`,
    code: 2,
    user: req.user?.id,
  });
});

export const handler = async (
  req: Request,
  res: Response,
  next: NextFunction,
  err?: Error,
  user?: User,
  info?: Record<string, string>
) => {
  try {
    if (err || !user) {
      const error = new RedirectError(FAILURE_CLIENT_URL);
      return next(error);
    }

    req.session.user = user.id;

    logger.info({
      message: `${user.email} | User Successfully Logged in`,
      user: user.id,
      code: 1,
    });

    await UserModel.findByIdAndUpdate(user.id, {
      $set: { isRegistered: true },
    });

    return res.redirect(CALLBACK_CLIENT_URL);
  } catch (error) {
    return next(error);
  }
};
