import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { HttpError } from "../error/HttpError";
import { RedirectError } from "../error/RedirectError";

const errorHandler: ErrorRequestHandler = (
  error: TypeError | HttpError,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  if (error instanceof HttpError) {
    return res.json(error.display());
  } else if (error instanceof RedirectError) {
    res.redirect(error.to);
  } else if (error instanceof Error) {
    return res.json(new HttpError(500, error.message).display());
  } else {
    return res.json(new HttpError(500, "Unknown error").display());
  }
};

export default errorHandler;
