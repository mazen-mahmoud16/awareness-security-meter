import { Document, model, Schema } from "mongoose";
import { Tenant } from "..";

export interface TenantReport extends Document {
  id: string;
  tenant: Tenant;
  title: string;
  filePath: string;
  createdAt: Date;
  status: "pending" | "completed" | "failed";
}

const TenantReportSchema = new Schema<TenantReport>({
  title: {
    type: String,
    required: true,
  },
  tenant: {
    ref: "Tenant",
    type: Schema.Types.ObjectId,
  },
  filePath: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
});

const TenantReportModel = model<TenantReport>(
  "TenantReport",
  TenantReportSchema
);

export default TenantReportModel;
