import { Document, model, Schema } from "mongoose";
import { Program } from ".";
import ModuleSessionModel from "../module/session";
import { User } from "../user";

export interface ProgramSession extends Document {
  id: string;
  program: Program;
  user: User;
  start?: Date;
  end?: Date;
  isCompleted: boolean;
  /**
   * Move To Next Module
   *
   * @memberof ProgramSession
   */
  next(user: string, modules: string[]): Promise<NextProgramReturn>;
  /**
   * Index of Last Module
   *
   * @type {number}
   * @memberof ProgramSession
   */
  progress: number;
}

const ProgramSessionSchema = new Schema<ProgramSession>({
  program: {
    type: Schema.Types.ObjectId,
    ref: "Program",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  start: {
    type: Schema.Types.Date,
  },
  end: Schema.Types.Date,
  progress: {
    type: Number,
    default: 0,
  },
  isCompleted: { type: Boolean, default: false, required: true },
});

type NextProgramReturn =
  | "Module Not Completed"
  | "Program Completed"
  | "Next Module";

ProgramSessionSchema.methods.next = async function (
  this: ProgramSession,
  user: string,
  modules: string[]
): Promise<NextProgramReturn> {
  const session = await ModuleSessionModel.findOne({
    user,
    module: modules[this.progress],
  });
  if (!session?.isCompleted) {
    return "Module Not Completed";
  }

  if (this.progress === modules.length - 1) {
    this.isCompleted = true;
    this.end = new Date();
    this.markModified("isCompleted");
    this.markModified("end");
    await this.save();
    return "Program Completed";
  }

  await ModuleSessionModel.findOneAndDelete({
    user,
    module: modules[this.progress + 1],
  });

  this.progress++;
  this.markModified("progress");
  this.save();

  return "Next Module";
};

const ProgramSessionModel = model<ProgramSession>(
  "ProgramSession",
  ProgramSessionSchema
);

export default ProgramSessionModel;
