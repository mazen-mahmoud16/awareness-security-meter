import { RequestHandler } from "express";
import { HttpError } from "../../error/HttpError";
import asyncHandler from "../asyncHandler";
import jwt from "jsonwebtoken";
import UserModel from "../../../models/user";

const authenticate: RequestHandler = asyncHandler(async (req, _, next) => {
  if (req.session.user) {
    const user = await UserModel.findById(req.session.user).select(
      "-password -__v"
    );
    if (user) {
      req.user = user;
      return next();
    }
  }

  throw new HttpError(401, "Not authenticated");
});

export default authenticate;
