import { PipelineStage, Types } from "mongoose";
import { PaginationParams } from "../../lib/interfaces/PaginationParams";
import ModuleModel, { Module, ModuleType } from "../../models/module";
import ModuleSessionModel from "../../models/module/session";
import { User } from "../../models/user";
import { validateDepartment } from "../aggregation";

export async function findCompletedModules(user: string) {
  const sessions = await ModuleSessionModel.aggregate([
    {
      $match: {
        $and: [{ user: new Types.ObjectId(user) }, { isCompleted: true }],
      },
    },
    {
      $project: {
        module: 1,
      },
    },
  ]);
  return sessions.map((session) => session.module);
}

export function validateModule(user: User, library = false) {
  const inLibrary = library ? [true] : [true, false];
  return [
    {
      $lookup: {
        from: "tenantmodules",
        as: "tenantModule",
        let: { module: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$$module", "$module"] },
                  {
                    $eq: ["$tenant", new Types.ObjectId(user.tenant as string)],
                  },
                  { $in: ["$showInLibrary", inLibrary] },
                  { $eq: ["$disabled", false] },
                ],
              },
            },
          },
        ],
      },
    },
    {
      $unwind: { path: "$tenantModule", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "programs",
        as: "programs",
        let: { module: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$$module", "$modules"],
              },
            },
          },
          {
            $lookup: {
              from: "tenantprograms",
              as: "tenantProgram",
              let: { program: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$$program", "$program"] },
                        {
                          $eq: [
                            "$tenant",
                            new Types.ObjectId(user.tenant as string),
                          ],
                        },
                        { $in: ["$showModulesInLibrary", inLibrary] },
                        { $eq: ["$disabled", false] },
                      ],
                    },
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: "$tenantProgram",
            },
          },
          {
            $project: { tenantProgram: 1 },
          },
        ],
      },
    },
    {
      $match: {
        $or: [
          { "tenantModule.deadlines": validateDepartment(user.department) },
          {
            programs: {
              $elemMatch: {
                "tenantProgram.deadlines": validateDepartment(user.department),
              },
            },
          },
        ],
      },
    },
  ];
}

export async function findModulesForUser(
  user: User,
  type?: ModuleType,
  pagination: PaginationParams = { skip: 0, take: 10, search: "" }
): Promise<Module[]> {
  const completedModules = await findCompletedModules(user.id);

  var searchFilter = pagination.search
    ? { $text: { $search: pagination.search } }
    : {};

  var typeFilter = type ? { type } : {};
  const modules = await ModuleModel.aggregate([
    {
      $match: {
        ...searchFilter,
        ...typeFilter,
      },
    },
    ...validateModule(user, true),
    {
      $skip: pagination.skip,
    },
    {
      $limit: pagination.take,
    },
    {
      $addFields: {
        id: "$_id",
        isCompleted: { $in: ["$_id", completedModules] },
      },
    },
    {
      $unset: [
        "content",
        "_id",
        "__v",
        "programs",
        "tenantModule",
        "thumbnailImage",
        "coverImage",
      ],
    },
  ]);

  return modules;
}

export const unsetFields = [
  "_id",
  "__v",
  "content.slides.body.answer",
  "content.slides.body.image",
  "content.slides.body.video",
  "content.questions.answers",
];

export async function findModuleForUser(
  id: string,
  user: User,
  options: { unset?: string[] | boolean } = {}
): Promise<Module | undefined> {
  const completedModules = await findCompletedModules(user.id);

  const pipeline: PipelineStage[] = [
    {
      $match: {
        _id: new Types.ObjectId(id),
      },
    },
    ...validateModule(user),
    {
      $addFields: {
        id: "$_id",
        isCompleted: { $in: ["$_id", completedModules] },
      },
    },
  ];

  if (options.unset !== false) {
    if (options.unset === true) pipeline.push({ $unset: unsetFields });
    else pipeline.push({ $unset: options.unset || unsetFields });
  }

  const [module] = await ModuleModel.aggregate(pipeline);

  return module;
}

export async function deleteModule(id: string) {
  await ModuleModel.findByIdAndDelete({ id });
  await ModuleSessionModel.deleteMany({ module: id });
}
