import { Document, model, Schema, Types } from "mongoose";
import { Tenant } from "../..";
import { AUTHENTICATION_STRATEGIES } from "../../../lib/constants";

export interface MicrosoftSAMLOptions {
  issuer: string;
  cert: string;
  entryPoint: string;
  redirectUrl?: string;
}

export interface GoogleAuthOptions {
  clientSecret: string;
  clientId: string;
}

export interface TenantAuthInput {
  name: string;
  tenant: string | Types.ObjectId;
  type: (typeof AUTHENTICATION_STRATEGIES)[number];
  options: MicrosoftSAMLOptions | GoogleAuthOptions;
}

export interface TenantAuth extends Document, TenantAuthInput {
  id: string;
}

const TenantAuthschema = new Schema<TenantAuth>({
  name: {
    type: String,
    required: true,
  },
  type: String,
  tenant: {
    ref: "Tenant",
    type: Schema.Types.ObjectId,
  },
  options: Schema.Types.Mixed,
});

const TenantAuthModel = model<TenantAuth>("TenantAuth", TenantAuthschema);

export default TenantAuthModel;
