import { Document, model, Schema, Types } from "mongoose";
import argon2 from "argon2";

export enum Language {
  ENGLISH = "en",
  ARABIC = "ar",
}

export interface UserInput {
  email: string;
  name?: string;
  tenant: string | Types.ObjectId;
  department: string;
  attributes?: Object;
  authProvider?: string | Types.ObjectId;
  prefferedLanguage?: Language;
  isRegistered?: boolean;
  password?: string;
}

export interface User extends UserInput, Document {
  id: string;
  comparePassword(givenPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
    default: "default",
  },
  name: {
    type: String,
  },
  tenant: {
    ref: "Tenant",
    type: Schema.Types.ObjectId,
  },
  attributes: {
    type: Schema.Types.Mixed,
  },
  password: {
    type: String,
  },
  prefferedLanguage: {
    type: String,
    enum: Language,
    default: Language.ENGLISH,
  },
  isRegistered: {
    type: Boolean,
    default: false,
  },
  authProvider: { ref: "TenantAuth", type: Schema.Types.ObjectId },
});

UserSchema.index({ name: "text", email: "text", department: "text" });

UserSchema.methods.comparePassword = async function (
  this: User,
  givenPassword: string
): Promise<boolean> {
  return argon2.verify(this.password!, givenPassword).catch(() => false);
};

UserSchema.pre("save", async function (this, next) {
  if (this.isModified("password") && this.password) {
    const hash = await argon2.hash(this.password!);
    this.password = hash;
    return next();
  }
});

const UserModel = model<User>("User", UserSchema);

export default UserModel;
