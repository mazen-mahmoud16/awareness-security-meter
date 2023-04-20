import { Document, model, Schema } from "mongoose";
import { Tenant } from "..";
import { Program } from "../../program";
import { TenantDeadline, TenantDeadlineSchema } from "../deadline";

export interface TenantProgram extends Document {
  id: string;
  program: Program;
  tenant: Tenant;
  showInLibrary?: boolean;
  showModulesInLibrary?: boolean;
  disabled?: boolean;
  deadlines: TenantDeadline[];
}

const TenantProgramSchema = new Schema<TenantProgram>({
  program: {
    ref: "Program",
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
  showModulesInLibrary: {
    default: true,
    type: Boolean,
  },
  disabled: {
    type: Boolean,
  },
  deadlines: [TenantDeadlineSchema],
});

const TenantProgramModel = model<TenantProgram>(
  "TenantProgram",
  TenantProgramSchema
);

export default TenantProgramModel;
