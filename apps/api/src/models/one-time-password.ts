import { Document, Schema, model } from "mongoose";
import { User } from "./user";

export interface OneTimePassword extends Document {
  user: User;
  token: string;
  createdAt: Date;
  attempts?: number;
}

const OneTimePasswordSchema = new Schema<OneTimePassword>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

OneTimePasswordSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 5 } // 5 minutes
);

const OneTimePasswordModel = model<OneTimePassword>(
  "OneTimePassword",
  OneTimePasswordSchema
);

export default OneTimePasswordModel;
