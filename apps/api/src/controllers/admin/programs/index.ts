import { HttpError } from "../../../lib/error/HttpError";
import logger from "../../../lib/logger";
import asyncHandler from "../../../lib/middlewares/asyncHandler";
import getOne from "../../../lib/middlewares/getOne";
import paginate from "../../../lib/middlewares/paginate";
import arraysEqual from "../../../lib/util/arraysEqual";
import ProgramModel from "../../../models/program";
import ProgramSessionModel from "../../../models/program/session";
import TenantProgramModel from "../../../models/tenant/tenant-program";

export const programs = paginate({
  model: ProgramModel,
  filterFn(req) {
    var filter: Record<string, any> = {};
    if (req.body.tenant) filter["tenant"] = req.body.tenant;
    if (req.body.tenant === "none") filter["tenant"] = undefined;
    if (req.body.type) filter["type"] = req.body.type;
    return filter;
  },
  select: "name description thumbnailImage",
});

export const program = getOne({
  model: ProgramModel,
});

export const createProgram = asyncHandler(async (req, res) => {
  const body = req.body;

  const program = await ProgramModel.create(body);

  logger.info({
    message: `Program Created`,
    code: 12,
    admin: req.admin.id,
    program: JSON.parse(JSON.stringify(program)),
  });

  return res.json({ code: 200, result: { id: program.id } });
});

export const deleteProgram = asyncHandler(async (req, res) => {
  const program = await ProgramModel.findByIdAndDelete(req.params.id);
  if (program) {
    await TenantProgramModel.deleteMany({ program: program.id });
    await ProgramSessionModel.deleteMany({ program: program.id });

    logger.info({
      message: `Program Deleted`,
      code: 14,
      admin: req.admin.id,
      program: program.id,
    });
  }
  return res.json({ code: 200 });
});

export const editProgram = asyncHandler(async (req, res) => {
  const program = await ProgramModel.findById(req.params.id);

  if (!program) throw new HttpError(404, "Invalid Program");

  const newProgram = await ProgramModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (
    !arraysEqual(
      program.modules.map((m) => m.toString()),
      req.body.modules
    )
  ) {
    await ProgramSessionModel.deleteMany({ program: program.id });
  }

  logger.info({
    message: `Program Edited`,
    code: 13,
    admin: req.admin.id,
    program: JSON.parse(JSON.stringify(newProgram)),
  });

  return res.json({ code: 200 });
});
