import { Types } from "mongoose";
import { PaginationParams } from "../../lib/interfaces/PaginationParams";
import { Program, User } from "../../models";
import ProgramModel from "../../models/program";
import ProgramSessionModel from "../../models/program/session";
import TenantProgramModel from "../../models/tenant/tenant-program";
import { validateDepartment } from "../aggregation";

export async function findCompletedPrograms(user: string) {
  const sessions = await ProgramSessionModel.aggregate([
    {
      $match: {
        $and: [{ user: new Types.ObjectId(user) }, { isCompleted: true }],
      },
    },
    {
      $project: {
        program: 1,
      },
    },
  ]);

  return sessions.map((session) => session.program);
}

export async function lookupModulesInProgram(id: string, user: string) {
  return await ProgramModel.aggregate([
    {
      $match: { _id: new Types.ObjectId(id) },
    },
    {
      $lookup: {
        from: "modules",
        let: {
          moduleIds: "$modules",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $in: ["$_id", "$$moduleIds"] }],
              },
            },
          },
          {
            $addFields: { __order: { $indexOfArray: ["$$moduleIds", "$_id"] } },
          },
          {
            $lookup: {
              from: "module_sessions",
              as: "session",
              let: { moduleId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$module", "$$moduleId"] },
                        { $eq: ["$user", new Types.ObjectId(user)] },
                      ],
                    },
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: "$session",
              preserveNullAndEmptyArrays: true,
            },
          },
          { $sort: { __order: 1 } },
          {
            $project: {
              _id: 0,
              id: "$_id",
              name: "$name",
              type: "$type",
              slug: "$slug",
              description: "$description",
              isCompleted: { $ifNull: ["$session.isCompleted", false] },
            },
          },
        ],
        as: "modules",
      },
    },
    { $unwind: "$modules" },
    { $replaceRoot: { newRoot: "$modules" } },
  ]);
}

export async function findProgramForUser(
  id: string,
  user: User,
  options?: { exclude?: string[] }
): Promise<Program | undefined> {
  const [program] = await TenantProgramModel.aggregate([
    {
      $match: {
        program: new Types.ObjectId(id),
        tenant: new Types.ObjectId(user.tenant as string),
        disabled: false,
        deadlines: validateDepartment(user.department),
      },
    },
    {
      $lookup: {
        from: "programs",
        foreignField: "_id",
        localField: "program",
        as: "program",
      },
    },
    { $unwind: "$program" },
    { $replaceRoot: { newRoot: "$program" } },
    {
      $lookup: {
        from: "programsessions",
        as: "session",
        let: { programId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$program", "$$programId"] },
                  { $eq: ["$user", new Types.ObjectId(user.id)] },
                ],
              },
            },
          },
        ],
      },
    },
    {
      $unwind: { path: "$session", preserveNullAndEmptyArrays: true },
    },
    {
      $addFields: {
        id: "$_id",
        length: { $size: "$modules" },
        isCompleted: { $ifNull: ["$session.isCompleted", false] },
        progress: "$session.progress",
      },
    },
    { $unset: ["_id", "__v", "session", ...(options?.exclude || [])] },
  ]);

  return program;
}

export async function findProgramsForUser(
  user: User,
  pagination: PaginationParams = { skip: 0, take: 10, search: "" }
): Promise<Program[]> {
  const completedPrograms = await findCompletedPrograms(user.id);

  var searchFilter = pagination.search
    ? { $text: { $search: pagination.search } }
    : {};

  const programs = await TenantProgramModel.aggregate([
    {
      $match: {
        tenant: new Types.ObjectId(user.tenant as string),
        disabled: false,
        showInLibrary: true,
        ...searchFilter,
        deadlines: validateDepartment(user.department),
      },
    },
    {
      $skip: pagination.skip,
    },
    {
      $limit: pagination.take,
    },
    {
      $lookup: {
        from: "programs",
        foreignField: "_id",
        localField: "program",
        as: "program",
      },
    },
    { $unwind: "$program" },
    { $replaceRoot: { newRoot: "$program" } },
    {
      $addFields: {
        id: "$_id",
        isCompleted: { $in: ["$_id", completedPrograms] },
        length: { $size: "$modules" },
      },
    },
    { $unset: ["_id", "__v", "thumbnailImage", "coverImage", "modules"] },
  ]);

  return programs;
}
