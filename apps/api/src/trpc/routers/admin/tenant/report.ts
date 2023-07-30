import { z } from "zod";
import { adminProcedure, router } from "../../../trpc";
import UserModel from "../../../../models/user";
import TenantModel from "../../../../models/tenant";
import { TRPCError } from "@trpc/server";
import TenantReportModel, {
  TenantReport,
} from "../../../../models/tenant/tenant-report";
import path from "path";
import { TENANT_REPORTS_FOLDER } from "../../../../lib/constants";
import { createObjectCsvWriter } from "csv-writer";
import { findAverageScoreForUser } from "../../../../services/stats";
import {
  createTenantReport,
  updateTenantReportStatus,
} from "../../../../services/tenant/report";
import ModuleSessionModel from "../../../../models/module/session";
import ProgramSessionModel from "../../../../models/program/session";
import fs from "fs/promises";
import { TenantAuth } from "../../../../models/tenant/tenant-auth";
import { SafeDoc } from "../../../../models";

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

export const reportRouter = router({
  create: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const tenant = await TenantModel.findById(input.id).populate(
        "defaultProvider"
      );

      if (!tenant)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tenant Not Found",
        });

      const report = await TenantReportModel.findOne({ status: "pending" });
      if (report) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There is already a report being generated",
        });
      }

      const filePath = path.join(
        TENANT_REPORTS_FOLDER,
        input.id,
        `${Date.now()}.csv`
      );

      const folder = path.join(TENANT_REPORTS_FOLDER, input.id);
      await fs.mkdir(folder, { recursive: true });

      const tenantReport = await createTenantReport(
        input.id,
        input.title,
        filePath
      );

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

      const csvWriter = createObjectCsvWriter({
        path: filePath,
        header,
      });

      (async () => {
        try {
          const users = await UserModel.find({ tenant: input.id }).populate(
            "authProvider"
          );
          const records: TenantReportRecord[] = await Promise.all(
            users.map(async (user) => {
              const averageScore = await findAverageScoreForUser(user.id);
              const authProvider = ((user.authProvider as unknown as TenantAuth)
                ?.type ||
                tenant.defaultProvider?.type ||
                "default") as string;
              const moduleLength = await ModuleSessionModel.count({
                user: user.id,
              });
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
          await updateTenantReportStatus(tenantReport.id, "completed");
        } catch (e) {
          console.log("lmao", e);
          await updateTenantReportStatus(tenantReport.id, "failed");
        }
      })();
    }),
  list: adminProcedure.input(z.string()).query(async ({ input }) => {
    const reports = await TenantReportModel.find({ tenant: input })
      .sort({
        createdAt: -1,
      })
      .select("-filePath");
    return reports as unknown as {
      id: string;
      title: string;
      status: "pending" | "failed" | "completed";
      createdAt: Date;
    }[];
  }),
  delete: adminProcedure.input(z.string()).mutation(async ({ input }) => {
    const report = await TenantReportModel.findById(input);
    if (!report) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Report Not Found",
      });
    }
    await TenantReportModel.findByIdAndDelete(input);
    fs.unlink(report.filePath).catch(() => {});
  }),
});
