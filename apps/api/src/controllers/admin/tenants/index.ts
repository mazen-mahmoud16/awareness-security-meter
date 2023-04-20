import { RequestHandler } from "express";
import { HttpError } from "../../../lib/error/HttpError";
import logger from "../../../lib/logger";
import asyncHandler from "../../../lib/middlewares/asyncHandler";
import getOne from "../../../lib/middlewares/getOne";
import paginate from "../../../lib/middlewares/paginate";
import TenantModel from "../../../models/tenant";
import UserModel from "../../../models/user";
import { deleteTenant as remove } from "../../../services/tenant";

export const tenants = paginate({
  model: TenantModel,
  select: "-departments",
});

export const tenantNames = paginate({
  model: TenantModel,
  select: "name",
});

export const tenant = getOne({ model: TenantModel });

export const departments = getOne({
  model: TenantModel,
  select: "departments",
  transformResult(res) {
    return res?.departments;
  },
});

export const createTenant: RequestHandler = asyncHandler(async (req, res) => {
  const exists = await TenantModel.findOne({
    $or: [{ name: req.body.name }, { domain: req.body.domain }],
  });

  if (exists) {
    // if (exists.domain == req.body.domain)
    //   throw new HttpError(400, { domain: "Tenant Domain Already Exists" });
    if (exists.name === req.body.name)
      throw new HttpError(400, { domain: "Tenant Name Already Exists" });
  }

  const result = await TenantModel.create(req.body);

  logger.info({
    message: `Tenant Created`,
    code: 15,
    admin: req.admin.id,
    tenant: JSON.parse(JSON.stringify(result)),
  });

  return res.json({ code: 200, result: { id: result.id } });
});

export const editTenant: RequestHandler = asyncHandler(async (req, res) => {
  const exists = await TenantModel.findOne({
    $or: [{ name: req.body.name }, { domain: req.body.domain }],
  });

  if (exists && exists.id !== req.params.id) {
    // if (exists.domain == req.body.domain)
    //   throw new HttpError(400, { domain: "Tenant Domain Already Exists" });
    if (exists.name === req.body.name)
      throw new HttpError(400, { domain: "Tenant Name Already Exists" });
  }

  const result = await TenantModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  logger.info({
    message: `Tenant Edited`,
    code: 16,
    admin: req.admin.id,
    tenant: JSON.parse(JSON.stringify(result)),
  });

  return res.json({ code: 200, result });
});

export const deleteTenant: RequestHandler = asyncHandler(async (req, res) => {
  await remove(req.params.id);

  logger.info({
    message: `Tenant Deleted`,
    code: 17,
    admin: req.admin.id,
    tenant: req.params.id,
  });

  return res.json({ code: 200 });
});

export const deleteUsers: RequestHandler = asyncHandler(async (req, res) => {
  const id = req.params.id;

  await UserModel.deleteMany({ tenant: id });

  logger.info({
    message: `All Users Deleted`,
    code: 31,
    admin: req.admin.id,
    tenant: req.params.id,
  });

  return res.json({ code: 200 });
});
