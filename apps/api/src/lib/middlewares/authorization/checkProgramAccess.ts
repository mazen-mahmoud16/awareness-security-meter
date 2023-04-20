import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import ProgramModel from "../../../models/program";
import { findProgramForUser } from "../../../services/program";
import { HttpError } from "../../error/HttpError";
import asyncHandler from "../asyncHandler";

const checkProgramAccess = (options?: { exclude?: string[] }): RequestHandler =>
  asyncHandler(async (req, res, next) => {
    var regex = new RegExp(/^[a-f\d]{24}$/i);
    const isObjectId = regex.test(req.params.id);
    var id;
    if (isObjectId) {
      id = req.params.id;
    } else {
      const p = await ProgramModel.findOne({ slug: req.params.id });
      if (!p) throw new HttpError(404, "Program Not Found");
      id = p.id;
    }
    const program = await findProgramForUser(id, req.user!, {
      exclude: options?.exclude,
    });
    if (!program) throw new HttpError(400, "Program not found");

    req.program = program;
    return next();
  });

export default checkProgramAccess;
