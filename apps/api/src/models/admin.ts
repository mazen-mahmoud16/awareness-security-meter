import { Document, model, Schema } from "mongoose";
import argon2 from "argon2";

export interface Admin extends Document {
  id: string;
  email: string;
  password: string;
  comparePassword(givenPassword: string): Promise<Boolean>;
}

const AdminSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

AdminSchema.methods.comparePassword = async function (
  this: Admin,
  givenPassword: string
): Promise<boolean> {
  const user = this;

  return argon2.verify(user.password, givenPassword).catch(() => false);
};

AdminSchema.pre("save", async function (this, next) {
  if (this.isModified("password")) {
    const hash = await argon2.hash(this.password);
    this.password = hash;
    return next();
  }
});

const AdminModel = model<Admin>("Admin", AdminSchema);

export default AdminModel;
