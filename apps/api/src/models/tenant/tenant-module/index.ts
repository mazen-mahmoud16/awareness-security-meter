import { Document, model, Schema } from "mongoose";
import { Module } from "../../module";
import { Tenant } from "..";
import { TenantDeadline, TenantDeadlineSchema } from "../deadline";

export interface TenantModule extends Document {
  id: string;
  module: Module;
  tenant: Tenant;
  showInLibrary?: boolean;
  disabled?: boolean;
  deadlines: TenantDeadline[];
}

const TenantModuleSchema = new Schema<TenantModule>({
  module: {
    ref: "Module",
    type: Schema.Types.ObjectId,
  },
  tenant: {
    ref: "Tenant",
    type: Schema.Types.ObjectId,
  },
  showInLibrary: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  deadlines: [TenantDeadlineSchema],
});

const TenantModuleModel = model<TenantModule>(
  "TenantModule",
  TenantModuleSchema
);

export default TenantModuleModel;
