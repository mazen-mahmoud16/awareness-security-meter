import argon2 from "argon2";
import { RequestHandler } from "express";
import { HttpError } from "../../../lib/error/HttpError";
import logger from "../../../lib/logger";
import asyncHandler from "../../../lib/middlewares/asyncHandler";
import AdminModel from "../../../models/admin";

const loginAdmin = async (email: string, password: string) => {
  const exists = await AdminModel.findOne({ email });
  if (!exists) return { isCorrect: false };
  const isCorrect = await argon2.verify(exists.password, password);
  return { isCorrect, user: exists };
};

export const login: RequestHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { isCorrect, user } = await loginAdmin(email, password);
  if (isCorrect && user) {
    logger.info({
      message: `${user.email} | Admin Successfully Logged in`,
      code: 7,
      admin: user.id,
    });

    req.session.admin = user.id;
    return res.json({
      code: 200,
      result: { user: { id: user.id, email: user.email } },
    });
  } else {
    throw new HttpError(400, { password: "Invalid Email or Password" });
  }
});

export const me: RequestHandler = asyncHandler((req, res) => {
  return res.json({
    code: 200,
    result: { id: req.admin.id, email: req.admin.email },
  });
});

export const signOut: RequestHandler = asyncHandler((req, res) => {
  if (!req.session.user) {
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
    req.session.admin = undefined;
    res.json({ code: 200, message: "Sucessfully Signed out" });
  } else {
    res.json({ code: 400, error: "Not Logged in" });
  }
  logger.info({
    message: `${req.admin?.email} | Admin Logged Out`,
    code: 8,
    admin: req.admin.id,
  });
});
