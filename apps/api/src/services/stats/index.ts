import { Types } from "mongoose";
import { PaginationParams } from "../../lib/interfaces/PaginationParams";
import { Program, ModuleInput } from "../../models";
import ModuleSessionModel from "../../models/module/session";
import ProgramSessionModel from "../../models/program/session";

export async function findTopNUsers(n: number, tenant: string): Promise<any[]> {
  return await ModuleSessionModel.aggregate([
    { $match: { "result.score": { $exists: true } } },
    {
      $lookup: {
        from: "users",
        as: "user",
        let: { userId: "$user" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$_id", "$$userId"],
                  },
                  {
                    $eq: ["$tenant", new Types.ObjectId(tenant)],
                  },
                ],
              },
            },
          },
        ],
      },
    },
    { $unwind: "$user" },
    { $group: { _id: "$user", averageScore: { $avg: "$result.score" } } },
    { $sort: { averageScore: -1 } },
    { $limit: n },
    {
      $project: {
        user: "$_id",
        averageScore: {
          $round: ["$averageScore", 2],
        },
        _id: 0,
      },
    },
    {
      $project: {
        "user.password": 0,
      },
    },
  ]);
}

export async function findAverageScoreForModule(
  module: string,
  tenant: string
): Promise<number> {
  const result = await ModuleSessionModel.aggregate([
    {
      $match: {
        module: new Types.ObjectId(module),
        "result.score": { $exists: true },
      },
    },
    {
      $lookup: {
        from: "users",
        as: "user",
        let: { userId: "$user" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$userId"] },
            },
          },
        ],
      },
    },
    { $unwind: "$user" },
    {
      $match: {
        "user.tenant": new Types.ObjectId(tenant),
      },
    },
    { $group: { _id: null, averageScore: { $avg: "$result.score" } } },
    { $project: { averageScore: { $round: ["$averageScore", 2] }, _id: 0 } },
  ]);

  return result[0]?.averageScore || 0;
}

export async function findAverageScoreForUser(user: string): Promise<number> {
  const [result] = await ModuleSessionModel.aggregate([
    {
      $match: {
        user: new Types.ObjectId(user),
        "result.score": { $exists: true },
      },
    },
    { $group: { _id: null, averageScore: { $avg: "$result.score" } } },
    { $project: { score: { $round: ["$averageScore", 2] }, _id: 0 } },
  ]);

  return result?.score || 0;
}

export async function findAverageScore(tenant: string) {
  const result = await ModuleSessionModel.aggregate([
    {
      $match: {
        "result.score": { $exists: true },
      },
    },
    {
      $lookup: {
        from: "users",
        as: "user",
        let: { userId: "$user" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$userId"] },
            },
          },
        ],
      },
    },
    {
      $match: {
        "user.tenant": new Types.ObjectId(tenant),
      },
    },
    { $group: { _id: null, averageScore: { $avg: "$result.score" } } },
    { $project: { averageScore: { $round: ["$averageScore", 2] }, _id: 0 } },
  ]);

  return result[0]?.averageScore || 0;
}

export async function findUsersInProgram(
  program: string,
  tenant: string,
  pagination: PaginationParams
) {
  const result = await ProgramSessionModel.aggregate([
    {
      $match: {
        program: new Types.ObjectId(program),
      },
    },
    {
      $lookup: {
        from: "users",
        as: "user",
        let: { userId: "$user" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$userId"] },
            },
          },
        ],
      },
    },
    {
      $match: {
        "user.tenant": new Types.ObjectId(tenant),
      },
    },
    {
      $unwind: "$user",
    },
    { $skip: pagination.skip },
    { $limit: pagination.take },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            {
              isCompleted: "$isCompleted",
              start: "$start",
              end: "$end",
              programSessionId: "$_id",
            },
            "$user",
          ],
        },
      },
    },
    {
      $addFields: { id: "$_id" },
    },
    {
      $unset: ["password", "prefferedLanguage", "tenant", "__v", "_id"],
    },
  ]);

  return result;
}

export async function findProgramsForUser(id: string) {
  const programSessions = await ProgramSessionModel.find({
    user: id,
  })
    .sort("isCompleted")
    .populate<{ program: Program }>("program");

  var result: {
    id: string;
    name: string;
    progress: number;
    start: string;
    end: string;
    isCompleted: boolean;
    length: number;
    slug: string;
  }[] = [];

  for (const {
    program,
    progress,
    start,
    end,
    isCompleted,
  } of programSessions) {
    result.push({
      id: program._id,
      name: program.name,
      progress: progress,
      start: start as unknown as string,
      end: end as unknown as string,
      isCompleted,
      length: program.modules.length,
      slug: program.slug,
    });
  }

  return result;
}

export async function findTopNScoresForModule(
  module: string,
  tenant: string,
  pagination: PaginationParams
) {
  const result = await ModuleSessionModel.aggregate([
    {
      $match: {
        module: new Types.ObjectId(module),
      },
    },
    {
      $lookup: {
        from: "users",
        as: "user",
        let: { userId: "$user" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$_id", "$$userId"],
                  },
                  {
                    $eq: ["$tenant", new Types.ObjectId(tenant)],
                  },
                ],
              },
            },
          },
        ],
      },
    },
    {
      $unwind: "$user",
    },
    { $sort: { "result.score": -1 } },
    { $skip: pagination.skip },
    { $limit: pagination.take },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            {
              isCompleted: "$isCompleted",
              start: "$start",
              end: "$end",
              score: { $round: ["$result.score", 2] },
              moduleSessionId: "$_id",
            },
            "$user",
          ],
        },
      },
    },
    {
      $addFields: { id: "$_id" },
    },
    {
      $unset: ["password", "prefferedLanguage", "tenant", "__v", "_id"],
    },
  ]);
  return result;
}

export async function findModulesForUser(
  user: string,
  pagination: PaginationParams
) {
  const result = await ModuleSessionModel.aggregate([
    {
      $match: {
        user: new Types.ObjectId(user),
      },
    },
    {
      $sort: { start: -1 },
    },
    { $skip: pagination.skip },
    { $limit: pagination.take },
    {
      $lookup: {
        from: "modules",
        foreignField: "_id",
        localField: "module",
        as: "module",
      },
    },
    { $unwind: "$module" },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            {
              isCompleted: "$isCompleted",
              start: "$start",
              end: "$end",
              score: { $round: ["$result.score", 2] },
            },
            "$module",
          ],
        },
      },
    },
    {
      $addFields: {
        id: "$_id",
      },
    },
    {
      $unset: ["_id", "__v", "content"],
    },
  ]);

  return result as (ModuleInput & {
    id: string;
    isCompleted: boolean;
    start: string;
    end: string;
    score?: number;
  })[];
}
