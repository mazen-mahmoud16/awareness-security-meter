import { Types } from "mongoose";
import logger from "../../../lib/logger";
import asyncHandler from "../../../lib/middlewares/asyncHandler";
import getOne from "../../../lib/middlewares/getOne";
import paginate from "../../../lib/middlewares/paginate";
import paginateQuery from "../../../lib/util/paginateQuery";
import ModuleModel from "../../../models/module";
import ModuleSessionModel from "../../../models/module/session";
import TenantModuleModel from "../../../models/tenant/tenant-module";
import {
  findAverageScoreForModule,
  findTopNScoresForModule,
} from "../../../services/stats";

export const modules = paginate({
  model: TenantModuleModel,
  filterFn(req) {
    return { tenant: req.params.id };
  },
  populate: { path: "module", select: "name description type" },
});

export const module = getOne({
  paramName: "mid",
  model: TenantModuleModel,
});

const select = "id name thumbnailImage";
export const moduleNames = asyncHandler(async (req, res) => {
  const { tenantOnly } = req.body;

  var filter: Record<string, any> = {};

  if (tenantOnly) filter["tenant"] = new Types.ObjectId(req.params.id);

  var [result] = await TenantModuleModel.aggregate([
    {
      $match: {
        tenant: new Types.ObjectId(req.params.id),
      },
    },
    {
      $group: {
        _id: "$tenant",
        modules: { $push: "$module" },
      },
    },
  ]);

  if (!result) {
    result = await ModuleModel.find(filter).select(select);
  } else {
    result = await ModuleModel.find({
      ...filter,
      _id: { $nin: result.modules },
    }).select(select);
  }

  return res.json({ code: 200, result });
});

export const editTenantModule = asyncHandler(async (req, res) => {
  const id = req.params.mid;

  const tenantModule = await TenantModuleModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  logger.info({
    message: `Edit Tenant Module`,
    code: 19,
    admin: req.admin.id,
    tenantModule: JSON.parse(JSON.stringify(tenantModule)),
  });

  return res.json({ code: 200 });
});

export const exposeModule = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const tenantModule = await TenantModuleModel.create({
    ...req.body,
    tenant: id,
  });

  logger.info({
    message: `Create Tenant Module Link`,
    code: 18,
    admin: req.admin.id,
    tenantModule: JSON.parse(JSON.stringify(tenantModule)),
  });

  return res.json({ code: 200 });
});

export const deleteTenantModule = asyncHandler(async (req, res) => {
  const id = req.params.mid;

  await TenantModuleModel.findByIdAndDelete(id);

  logger.info({
    message: `Delete Tenant Module Link`,
    code: 20,
    admin: req.admin.id,
    tenantModule: id,
  });

  return res.json({ code: 200 });
});

export const avgScoreForModule = asyncHandler(async (req, res) => {
  const module = req.params.mid;
  const tenant = req.params.id;

  const score = await findAverageScoreForModule(module, tenant);

  return res.json({ code: 200, result: score });
});

export const topUsersForModule = asyncHandler(async (req, res) => {
  const module = req.params.mid;
  const tenant = req.params.id;

  const { result, hasMore } = await paginateQuery(
    req.query as any,
    findTopNScoresForModule,
    module,
    tenant
  );

  return res.json({ code: 200, result, hasMore });
});

export const deleteModuleSession = asyncHandler(async (req, res) => {
  const module = req.params.mid;
  const user = req.params.uid;

  await ModuleSessionModel.deleteOne({ module, user });

  logger.info({
    message: `Delete Module Session`,
    code: 29,
    admin: req.admin.id,
    user,
    module,
  });

  return res.json({ code: 200 });
});
