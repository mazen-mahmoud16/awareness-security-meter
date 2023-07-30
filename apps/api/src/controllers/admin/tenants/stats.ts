import { RequestHandler } from "express";
import asyncHandler from "../../../lib/middlewares/asyncHandler";
import { findAverageScore } from "../../../services/stats";
import TenantReportModel from "../../../models/tenant/tenant-report";

export const avgScoreForTenant: RequestHandler = asyncHandler(
  async (req, res) => {
    const id = req.params.id;

    const result = await findAverageScore(id);

    return res.json({ code: 200, result });
  }
);

export const getReportForTenant: RequestHandler = asyncHandler(
  async (req, res) => {
    const reportId = req.params.rid;

    const report = await TenantReportModel.findById(reportId);

    if (!report) {
      return res.json({ code: 404, result: "Report Not Found" });
    }

    if (report.status != "completed") {
      return res.json({ code: 404, result: "Report Not Ready" });
    }

    return res.download(report.filePath, `${report.title}-Tenant-Report.csv`);
  }
);
