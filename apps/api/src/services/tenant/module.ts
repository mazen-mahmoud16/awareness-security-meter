import { FilterQuery } from "mongoose";
import { TenantModule } from "../../models";
import TenantModuleModel from "../../models/tenant/tenant-module";

export async function deleteTenantModule(filter: FilterQuery<TenantModule>) {
  await TenantModuleModel.deleteMany(filter);
}
