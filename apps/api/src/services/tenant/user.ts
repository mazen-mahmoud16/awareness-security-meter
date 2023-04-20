import { FilterQuery } from "mongoose";
import ModuleSessionModel from "../../models/module/session";
import ProgramSessionModel from "../../models/program/session";
import UserModel, { User } from "../../models/user";

export async function deleteUser(filter: FilterQuery<User>) {
  const users = (await UserModel.find(filter)).map((u) => u.id);
  await UserModel.deleteMany(filter);
  await ModuleSessionModel.deleteMany({ user: { $in: users } });
  await ProgramSessionModel.deleteMany({ user: { $in: users } });
}
