import { Request, RequestHandler } from "express";
import { HttpError } from "../error/HttpError";
import asyncHandler from "./asyncHandler";

export const queryToNumber = (queries: string[]): RequestHandler =>
  asyncHandler((req: Request, _, next) => {
    queries.forEach((query) => {
      if (req.query[query]) {
        if (isNaN(Number(req.query[query])))
          throw new HttpError(400, `${query} should be a number`);
        // @ts-ignore
        req.query[query] = Number(req.query[query]);
      }
    });
    next();
  });

export const paramToNumber = (params: string[]): RequestHandler =>
  asyncHandler((req: Request, _, next) => {
    params.forEach((param) => {
      if (req.params[param]) {
        if (isNaN(Number(req.params[param])))
          throw new HttpError(400, `${param} should be a number`);
        // @ts-ignore
        req.params[param] = Number(req.params[param]);
      }
    });
    next();
  });
