import { RequestHandler } from "express";
import { HttpError } from "../../error/HttpError";
import asyncHandler from "../asyncHandler";
import jwt from "jsonwebtoken";
import UserModel from "../../../models/user";
import AdminModel from "../../../models/admin";

const authenticate: RequestHandler = asyncHandler(async (req, _, next) => {
  if (req.session.admin) {
    const admin = await AdminModel.findById(req.session.admin).select(
      "-password -__v"
    );
    if (admin) {
      req.admin = admin;
      return next();
    }
  }

  throw new HttpError(401, "Not authenticated");
});

export default authenticate;
