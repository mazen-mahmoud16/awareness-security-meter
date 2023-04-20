import { Document, model, Schema } from "mongoose";
import { AUTHENTICATION_STRATEGIES } from "../../lib/constants";
import { Image } from "../content/image";
import UserModel from "../user";
import { TenantAuth } from "./tenant-auth";
import TenantModuleModel from "./tenant-module";

export interface Tenant extends Document {
  id: string;
  domain: string;
  name: string;
  logo: Image;
  darkLogo?: Image;
  departments: string[];
  lockToDomain: boolean;
  defaultProvider?: TenantAuth;
}

const TenantSchema = new Schema<Tenant>({
  name: {
    type: String,
    required: true,
  },
  lockToDomain: { type: Boolean, default: false },
  domain: {
    type: String,
    required: true,
  },
  logo: {
    type: Schema.Types.ObjectId,
    ref: "Image",
  },
  darkLogo: {
    type: Schema.Types.ObjectId,
    ref: "Image",
  },
  departments: [String],
  defaultProvider: { ref: "TenantAuth", type: Schema.Types.ObjectId },
});

TenantSchema.index({ name: "text" });

TenantSchema.pre("findOneAndDelete", async function (this, next) {
  const id = this.getQuery()["_id"];
  await TenantModuleModel.deleteMany({ tenant: id });
  await UserModel.deleteMany({ tenant: id });
  next();
});

const TenantModel = model<Tenant>("Tenant", TenantSchema);

export default TenantModel;
