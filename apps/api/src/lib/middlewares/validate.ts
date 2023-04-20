import { RequestHandler } from "express";
import { ZodError, ZodSchema } from "zod";
import { HttpError } from "../error/HttpError";
import asyncHandler from "./asyncHandler";

const validate = (
  schema: ZodSchema,
  type: "body" | "query" | "params" = "body"
): RequestHandler =>
  asyncHandler(async (req, _, next) => {
    try {
      schema.parse(req[type], {});
    } catch (e) {
      if (e instanceof ZodError) {
        const fieldErrors: any = {};
        Object.keys(e.formErrors.fieldErrors).forEach(function (key, index) {
          // @ts-ignore
          const err = e.formErrors.fieldErrors[key];
          if (err) fieldErrors[key] = err[0];
        });
        throw new HttpError(400, fieldErrors);
      }
      throw new HttpError(500);
    }
    return next();
  });

export default validate;
