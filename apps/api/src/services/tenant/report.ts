import TenantReportModel from "../../models/tenant/tenant-report";
import fs from "fs/promises";

export async function findTenantReports(id: string) {
  return await TenantReportModel.find({ tenant: id });
}

export async function findTenantReportById(id: string) {
  return await TenantReportModel.findById(id);
}

export async function deleteTenantReport(id: string) {
  const report = await TenantReportModel.findById(id);
  if (!report) return;
  await TenantReportModel.findByIdAndDelete(id);
  await fs.unlink(report.filePath);
}

export async function deleteTenantReports(id: string) {
  // Delete All reports
  const reports = await TenantReportModel.find({ tenant: id });
  await TenantReportModel.deleteMany({ tenant: id });
  await Promise.all(reports.map((report) => fs.unlink(report.filePath)));
}

export async function createTenantReport(
  tenant: string,
  title: string,
  filePath: string
) {
  const report = await TenantReportModel.create({
    tenant,
    title,
    filePath,
  });
  return report;
}

export async function updateTenantReportStatus(
  id: string,
  status: "pending" | "completed" | "failed"
) {
  await TenantReportModel.findByIdAndUpdate(id, {
    $set: {
      status,
    },
  });
}
