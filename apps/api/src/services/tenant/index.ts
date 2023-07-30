import TenantModel from "../../models/tenant";
import { deleteTenantModule } from "./module";
import { deleteTenantProgram } from "./program";
import { deleteTenantReports } from "./report";
import { deleteUser } from "./user";

export async function deleteTenant(id: string) {
  await TenantModel.findByIdAndDelete(id);
  await deleteTenantModule({ tenant: id });
  await deleteTenantProgram({ tenant: id });
  await deleteUser({ tenant: id });
  await deleteTenantReports(id);
}
