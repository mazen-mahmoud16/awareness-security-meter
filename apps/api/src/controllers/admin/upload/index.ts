import { RequestHandler } from "express";
import { HttpError } from "../../../lib/error/HttpError";
import asyncHandler from "../../../lib/middlewares/asyncHandler";

export const uploadFile: RequestHandler = asyncHandler((req, res) => {
  if (!req.file) throw new HttpError(400, "Invalid Request");
  return res.json({ code: 200, result: req.file.filename });
});
