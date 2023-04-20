import { Model } from "mongoose";
import { HttpError } from "../../../lib/error/HttpError";
import logger from "../../../lib/logger";
import asyncHandler from "../../../lib/middlewares/asyncHandler";
import getOne from "../../../lib/middlewares/getOne";
import paginate from "../../../lib/middlewares/paginate";
import ModuleModel, {
  AssessmentModuleModel,
  ModuleInput,
  ModuleType,
  PresentationModuleModel,
  VideoModuleModel,
} from "../../../models/module";
import ModuleSessionModel from "../../../models/module/session";
import TenantModuleModel from "../../../models/tenant/tenant-module";
import { validateContent } from "../../../validation/admin/module";

export const modules = paginate({
  model: ModuleModel,
  filterFn(req) {
    var filter: Record<string, any> = {};
    if (req.body.tenant) filter["tenant"] = req.body.tenant;
    if (req.body.tenant === "none") filter["tenant"] = undefined;
    if (req.body.type) filter["type"] = req.body.type;
    return filter;
  },
  select: "name description thumbnailImage duration type",
});

export const moduleNames = paginate({
  model: ModuleModel,
  select: "name thumbnailImage",
});

export const module = getOne({
  model: ModuleModel,
  select: "-_id -content.questions._id -content.questions.isMulti",
});

export const createModule = asyncHandler(async (req, res) => {
  const body = req.body as ModuleInput & { content: any };

  validateContent(body.type, body.content);

  const module = await ModuleModel.create(body);

  logger.info({
    message: `Module Created`,
    code: 9,
    admin: req.admin.id,
    module: JSON.parse(JSON.stringify(module)),
  });

  return res.json({ code: 200, result: { id: module.id } });
});

export const deleteModule = asyncHandler(async (req, res) => {
  const module = await ModuleModel.findByIdAndDelete(req.params.id);
  if (module) {
    await TenantModuleModel.deleteMany({ module: module.id });
    await ModuleSessionModel.deleteMany({ module: module.id });

    logger.info({
      message: `Module Deleted`,
      code: 11,
      admin: req.admin.id,
      module: module.id,
    });
  }

  return res.json({ code: 200 });
});

const TypeToModel: Record<ModuleType, Model<any>> = {
  1: AssessmentModuleModel,
  2: VideoModuleModel,
  3: PresentationModuleModel,
};

export const editModule = asyncHandler(async (req, res) => {
  var module = await ModuleModel.findById(req.params.id);

  if (!module) throw new HttpError(404, "Invalid Module");

  const type: ModuleType = req.body.type || module.type;

  if (req.body.content) validateContent(type, req.body.content, true);

  const newModule = await TypeToModel[type].findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  logger.info({
    message: `Module Edited`,
    code: 10,
    admin: req.admin.id,
    module: JSON.parse(JSON.stringify(newModule)),
  });

  return res.json({ code: 200 });
});
