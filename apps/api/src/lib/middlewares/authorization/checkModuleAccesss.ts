import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { ModuleType } from "../../../models";
import ModuleModel from "../../../models/module";
import { findModuleForUser } from "../../../services/module";
import { HttpError } from "../../error/HttpError";
import asyncHandler from "../asyncHandler";

const checkModuleAccess = (options?: {
  exclude?: string[] | boolean;
  type?: ModuleType;
}): RequestHandler =>
  asyncHandler(async (req, res, next) => {
    var regex = new RegExp(/^[a-f\d]{24}$/i);
    const isObjectId = regex.test(req.params.id);
    var id;
    if (isObjectId) {
      id = req.params.id;
    } else {
      const m = await ModuleModel.findOne({ slug: req.params.id });
      if (!m) throw new HttpError(404, "Module Not Found");
      id = m.id;
    }
    const module = await findModuleForUser(id, req.user!, {
      unset: options?.exclude,
    });
    if (!module) throw new HttpError(400, "Module not found");
    if (options?.type && options.type !== module.type)
      throw new HttpError(400, `Module should be of type ${options.type}`);
    req.module = module;
    return next();
  });

export default checkModuleAccess;
