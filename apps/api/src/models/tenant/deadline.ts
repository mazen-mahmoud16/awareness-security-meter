import { Document, Schema } from "mongoose";

export interface TenantDeadlineInput {
  department: string;
  deadline: Date;
}

export interface TenantDeadline extends Document, TenantDeadlineInput {
  id: string;
}

export const TenantDeadlineSchema = new Schema<TenantDeadline>({
  department: {
    type: String,
    required: true,
  },
  deadline: {
    type: Schema.Types.Date,
  },
});
