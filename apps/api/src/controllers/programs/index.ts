import { HttpError } from "../../lib/error/HttpError";
import logger from "../../lib/logger";
import asyncHandler from "../../lib/middlewares/asyncHandler";
import ImageModel from "../../models/content/image";
import ModuleSessionModel from "../../models/module/session";
import ProgramSessionModel from "../../models/program/session";
import {
  findProgramsForUser,
  lookupModulesInProgram,
} from "../../services/program";

export const programs = asyncHandler(async (req, res) => {
  var { take, skip, search } = req.query as any;

  skip = skip || 0;
  take = take || 10;
  var hasMore = false;

  var result = await findProgramsForUser(req.user!, {
    skip,
    take: take + 1,
    search,
  });

  if (result.length > take) {
    hasMore = true;
    result.pop();
  }

  return res.json({ code: 200, result, hasMore });
});

export const program = asyncHandler(async (req, res) => {
  return res.json({ code: 200, result: req.program });
});

export const programImage = (image: "coverImage" | "thumbnailImage") =>
  asyncHandler(async (req, res, next) => {
    const img = await ImageModel.findById(req.program[image]);
    req.imageUrl = img?.path;
    next();
  });

export const modules = asyncHandler(async (req, res) => {
  const modules = await lookupModulesInProgram(req.program.id, req.user?.id!);
  return res.json({ code: 200, result: modules });
});

export const start = asyncHandler(async (req, res) => {
  var programSession = await ProgramSessionModel.findOne({
    program: req.program.id,
    user: req.user?.id,
  });

  if (programSession?.isCompleted) {
    throw new HttpError(400, "Already Completed");
  }

  if (!programSession) {
    programSession = await ProgramSessionModel.create({
      program: req.program.id,
      user: req.user?.id,
      progress: 0,
      isCompleted: false,
      start: new Date(),
    });

    await ModuleSessionModel.findOneAndDelete({
      user: req.user?.id,
      module: req.program.modules[0],
      isCompleted: true,
    });
  }

  logger.info({
    message: `Program Started`,
    code: 5,
    user: req.user?.id,
    program: req.program.id,
  });

  return res.json({
    code: 200,
    result: { module: req.program.modules[programSession.progress || 0] },
  });
});

export const next = asyncHandler(async (req, res) => {
  var programSession = await ProgramSessionModel.findOne({
    program: req.program.id,
    user: req.user?.id,
  });

  if (!programSession) {
    throw new HttpError(400, "Program Not Started");
  }
  if (programSession.isCompleted) {
    throw new HttpError(400, "Already Completed");
  }

  const status = await programSession.next(
    req.user?.id!,
    req.program.modules as any[]
  );
  if (status === "Module Not Completed") {
    throw new HttpError(400, status);
  } else if (status === "Program Completed") {
    logger.info({
      message: `Program Completed`,
      code: 6,
      user: req.user?.id,
      program: req.program.id,
    });

    return res.json({
      code: 200,
      message: status,
    });
  }

  return res.json({
    code: 200,
    result: { module: req.program.modules[programSession.progress || 0] },
  });
});
