import { Types } from "mongoose";
import logger from "../../../lib/logger";
import asyncHandler from "../../../lib/middlewares/asyncHandler";
import getOne from "../../../lib/middlewares/getOne";
import paginate from "../../../lib/middlewares/paginate";
import paginateQuery from "../../../lib/util/paginateQuery";
import ProgramModel from "../../../models/program";
import ProgramSessionModel from "../../../models/program/session";
import TenantProgramModel from "../../../models/tenant/tenant-program";
import { findUsersInProgram } from "../../../services/stats";

export const programs = paginate({
  model: TenantProgramModel,
  filterFn(req) {
    return { tenant: req.params.id };
  },
  populate: { path: "program", select: "name description type" },
});

export const program = getOne({ model: TenantProgramModel, paramName: "pid" });

const select = "id name thumbnailImage";
export const programNames = asyncHandler(async (req, res) => {
  const { tenantOnly } = req.body;

  var filter: Record<string, any> = {};

  if (tenantOnly) filter["tenant"] = new Types.ObjectId(req.params.id);

  var [result] = await TenantProgramModel.aggregate([
    {
      $match: {
        tenant: new Types.ObjectId(req.params.id),
      },
    },
    {
      $group: {
        _id: "$tenant",
        programs: { $push: "$program" },
      },
    },
  ]);

  if (!result) {
    result = await ProgramModel.find(filter).select(select);
  } else {
    result = await ProgramModel.find({
      ...filter,
      _id: { $nin: result.programs },
    }).select(select);
  }

  return res.json({ code: 200, result });
});

export const editTenantProgram = asyncHandler(async (req, res) => {
  const id = req.params.pid;

  const tenantProgram = await TenantProgramModel.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  );

  logger.info({
    message: `Edit Tenant Program`,
    code: 22,
    admin: req.admin.id,
    tenantProgram: JSON.parse(JSON.stringify(tenantProgram)),
  });

  return res.json({ code: 200 });
});

export const exposeProgram = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const tenantProgram = await TenantProgramModel.create({
    tenant: id,
    ...req.body,
  });

  logger.info({
    message: `Create Tenant Program`,
    code: 21,
    admin: req.admin.id,
    tenantProgram: JSON.parse(JSON.stringify(tenantProgram)),
  });

  return res.json({ code: 200 });
});

export const deleteTenantProgram = asyncHandler(async (req, res) => {
  const id = req.params.pid;

  await TenantProgramModel.findByIdAndDelete(id);

  logger.info({
    message: `Delete Tenant Program`,
    code: 23,
    admin: req.admin.id,
    tenantProgram: id,
  });

  return res.json({ code: 200 });
});

export const usersInProgram = asyncHandler(async (req, res) => {
  const program = req.params.pid;
  const tenant = req.params.id;

  const { result, hasMore } = await paginateQuery(
    req.query as any,
    findUsersInProgram,
    program,
    tenant
  );

  return res.json({ code: 200, result, hasMore });
});

export const deleteProgramSession = asyncHandler(async (req, res) => {
  const program = req.params.pid;
  const user = req.params.uid;

  await ProgramSessionModel.deleteOne({ program, user });

  logger.info({
    message: `Delete Program Session`,
    code: 30,
    admin: req.admin.id,
    user,
    program,
  });

  return res.json({ code: 200 });
});
