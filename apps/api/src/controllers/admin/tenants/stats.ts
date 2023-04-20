import { createObjectCsvWriter } from "csv-writer";
import { RequestHandler } from "express";
import { HttpError } from "../../../lib/error/HttpError";
import asyncHandler from "../../../lib/middlewares/asyncHandler";
import ModuleSessionModel from "../../../models/module/session";
import ProgramSessionModel from "../../../models/program/session";
import TenantModel from "../../../models/tenant";
import { TenantAuth } from "../../../models/tenant/tenant-auth";
import UserModel from "../../../models/user";
import {
  findAverageScore,
  findAverageScoreForUser,
} from "../../../services/stats";
import path from "path";
import fs from "fs";
import { TEMP_FOLDER } from "../../../lib/constants";

export const avgScoreForTenant: RequestHandler = asyncHandler(
  async (req, res) => {
    const id = req.params.id;

    const result = await findAverageScore(id);

    return res.json({ code: 200, result });
  }
);

interface TenantReportRecord {
  id: string;
  name?: string;
  email: string;
  department: string;
  averageScore: number;
  isRegistered: boolean;
  authProvider: string;
  moduleLength: number;
  programLength: number;
}

export const generateReportForTenant: RequestHandler = asyncHandler(
  async (req, res) => {
    const id = req.params.id;

    const tenant = await TenantModel.findById(id).populate("defaultProvider");

    if (!tenant) throw new HttpError(404, "Tenant not found");

    const header: { id: string; title: string }[] = [
      { id: "id", title: "ID" },
      { id: "name", title: "Name" },
      { id: "email", title: "Email" },
      { id: "department", title: "Department" },
      { id: "averageScore", title: "Average Score" },
      { id: "isRegistered", title: "Is Registered" },
      { id: "authProvider", title: "Auth Provider" },
      { id: "moduleLength", title: "No. of Modules" },
      { id: "programLength", title: "No. of Programs" },
    ];

    const filePath = path.join(TEMP_FOLDER, `${Date.now()}-tenant-report.csv`);
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header,
    });

    const users = await UserModel.find({ tenant: id }).populate("authProvider");

    const records: TenantReportRecord[] = await Promise.all(
      users.map(async (user) => {
        const averageScore = await findAverageScoreForUser(user.id);
        const authProvider = ((user.authProvider as unknown as TenantAuth)
          ?.type ||
          tenant.defaultProvider?.type ||
          "default") as string;
        const moduleLength = await ModuleSessionModel.count({ user: user.id });
        const programLength = await ProgramSessionModel.count({
          user: user.id,
        });
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          department: user.department,
          averageScore,
          isRegistered:
            Boolean(user.isRegistered) ||
            !!user.password ||
            moduleLength > 0 ||
            programLength > 0,
          authProvider,
          moduleLength,
          programLength,
        };
      })
    );

    await csvWriter.writeRecords(records);

    res.download(filePath, `${tenant.name}-report.csv`, (err) => {
      if (err) {
        console.log(err);
        return res.json({ code: 500 });
      }
      fs.unlinkSync(filePath);
    });
  }
);
