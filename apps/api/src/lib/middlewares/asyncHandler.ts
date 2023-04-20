import { RequestHandler } from "express";

const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
