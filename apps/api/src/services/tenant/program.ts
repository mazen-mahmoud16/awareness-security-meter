import { FilterQuery } from "mongoose";
import { TenantProgram } from "../../models";
import TenantProgramModel from "../../models/tenant/tenant-program";

export async function deleteTenantProgram(filter: FilterQuery<TenantProgram>) {
  await TenantProgramModel.deleteMany(filter);
}
