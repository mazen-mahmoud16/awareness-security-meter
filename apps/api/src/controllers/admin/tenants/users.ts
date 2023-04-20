import csv from "csv-parser";
import { RequestHandler } from "express";
import fs from "fs";
import { z } from "zod";
import { HttpError } from "../../../lib/error/HttpError";
import logger from "../../../lib/logger";
import asyncHandler from "../../../lib/middlewares/asyncHandler";
import getOne from "../../../lib/middlewares/getOne";
import paginate from "../../../lib/middlewares/paginate";
import paginateQuery from "../../../lib/util/paginateQuery";
import ModuleSessionModel from "../../../models/module/session";
import ProgramSessionModel from "../../../models/program/session";
import TenantModel, { Tenant } from "../../../models/tenant";
import UserModel from "../../../models/user";
import {
  findAverageScoreForUser,
  findModulesForUser,
  findProgramsForUser,
} from "../../../services/stats";

export const getUsers = paginate({
  model: UserModel,
  select: "-password",
  filterFn(req) {
    var extraFilter: any = {};
    if (req.query.department) extraFilter["department"] = req.query.department;

    return { tenant: req.params.id, ...extraFilter };
  },
});

export const getUser = getOne({
  model: UserModel,
  paramName: "uid",
  filterFn(req) {
    return { tenant: req.params.id };
  },
  select: "-password",
});

const userCheck = (
  email: string,
  tenant: Tenant
): { error: boolean; message?: string } => {
  const { success } = z.string().email().safeParse(email);
  if (!success) return { error: true, message: `Invalid Email` };

  const domain = email.split("@").slice(-1)[0];

  if (tenant?.domain !== domain && tenant.lockToDomain)
    return { error: true, message: `Domain should be ${tenant.domain}` };
  return { error: false };
};

export const addUser: RequestHandler = asyncHandler(async (req, res) => {
  const email: string = req.body.email;

  const tenant = await TenantModel.findById(req.params.id);

  if (!tenant) throw new HttpError(400, { email: "Invalid Tenant" });

  const userStatus = userCheck(email, tenant);
  if (userStatus.error) {
    throw new HttpError(400, { email: userStatus.message });
  }

  const exists = await UserModel.findOne({ email }).populate("tenant");
  if (exists)
    throw new HttpError(400, {
      email: `Email Already Exists in ${(exists.tenant as any).name}`,
    });

  if (!tenant.departments.includes(req.body.department)) {
    tenant.departments.push(req.body.department);
    tenant.markModified("departments");
    await tenant.save();
  }

  const user = await UserModel.create({
    ...req.body,
    tenant: req.params.id,
  });

  logger.info({
    message: `User Created`,
    code: 26,
    admin: req.admin.id,
    user: JSON.parse(JSON.stringify(user)),
  });

  return res.json({ code: 200, result: user });
});

export const editUser: RequestHandler = asyncHandler(async (req, res) => {
  await UserModel.updateOne(
    { id: req.params.uid, tenantId: req.params.id },
    req.body,
    { new: true }
  );
  const user = await UserModel.findById(req.params.uid);
  if (user)
    logger.info({
      message: `User Edited`,
      code: 27,
      admin: req.admin.id,
      user: JSON.parse(JSON.stringify(user)),
    });

  return res.json({ code: 200 });
});

export const deleteUser: RequestHandler = asyncHandler(async (req, res) => {
  await UserModel.findByIdAndDelete(req.params.uid);
  await ModuleSessionModel.deleteMany({ user: req.params.uid });
  await ProgramSessionModel.deleteMany({ user: req.params.uid });

  logger.info({
    message: `User Deleted`,
    code: 28,
    admin: req.admin.id,
  });

  return res.json({ code: 200 });
});

const REQUIRED_HEADERS = ["department", "email", "name"] as const;
type HeaderType = (typeof REQUIRED_HEADERS)[number];

export const importUsers: RequestHandler = asyncHandler(async (req, res) => {
  const filePath = req.file?.path;
  const content = fs.readFileSync(filePath!);

  var results: { department: string; email: string; name: string }[] = [];

  try {
    fs.createReadStream(filePath!)
      .pipe(
        csv({
          mapHeaders({ header }) {
            return header.toLowerCase();
          },
          strict: true,
          mapValues(args) {
            if (args.header === "email") {
              return args.value?.toLowerCase();
            }
            return args.value;
          },
        })
      )
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", async () => {
        try {
          const tenant = await TenantModel.findById(req.params.id);
          if (!tenant) throw new HttpError(400, "Invalid Tenant");
          tenant.domain = tenant.domain.toLowerCase();

          results = results
            .filter((r) => r.email)
            .filter((u) => !userCheck(u.email, tenant).error)
            .map((u) => ({ ...u, department: u.department || "Default" }));

          results.forEach((u) => {
            if (!tenant.departments.includes(u.department)) {
              tenant.departments.push(u.department);
              tenant.markModified("departments");
            }
          });

          const query = results.map((user) => ({
            updateOne: {
              filter: { email: user.email, tenant: tenant.id },
              update: user,
              upsert: true,
            },
          }));

          const { modifiedCount, upsertedCount } = await UserModel.bulkWrite(
            query
          );

          await tenant.save();

          fs.unlinkSync(filePath!);

          return res.json({
            code: 200,
            result: { modifiedCount, upsertedCount },
          });
        } catch (e) {
          if (e instanceof HttpError) {
            return res.json(e.display());
          } else {
            return res.json({ code: 500 });
          }
        }
      })
      .on("error", () => {
        return res.json(
          new HttpError(
            400,
            "Error Parsing CSV. Make sure there is a column for each email, department, name"
          ).display()
        );
      });
  } catch (error) {
    console.log(error);
    throw new HttpError(
      500,
      "Error Parsing CSV. Make sure there is a column for each email, department, name"
    );
  }
});

export const avgScoreForUser = asyncHandler(async (req, res) => {
  const score = await findAverageScoreForUser(req.params.uid);
  return res.json({ code: 200, result: score });
});

export const modulesForUser = asyncHandler(async (req, res) => {
  const { result, hasMore } = await paginateQuery(
    req.query as any,
    findModulesForUser,
    req.params.uid
  );

  return res.json({ code: 200, result, hasMore });
});

export const programsForUser = asyncHandler(async (req, res) => {
  const { result, hasMore } = await paginateQuery(
    req.query as any,
    findProgramsForUser,
    req.params.uid
  );
  return res.json({ code: 200, result, hasMore });
});
