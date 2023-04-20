import asyncHandler from "../../lib/middlewares/asyncHandler";
import paginateQuery from "../../lib/util/paginateQuery";
import {
  findAverageScoreForUser,
  findModulesForUser,
  findProgramsForUser,
} from "../../services/stats";

export const avgScore = asyncHandler(async (req, res) => {
  const score = await findAverageScoreForUser(req.user?.id!);

  return res.json({ code: 200, result: score });
});

export const recentModules = asyncHandler(async (req, res) => {
  const { result, hasMore } = await paginateQuery(
    req.query as any,
    findModulesForUser,
    req.user?.id!
  );

  return res.json({ code: 200, result, hasMore });
});

export const recentPrograms = asyncHandler(async (req, res) => {
  const { result, hasMore } = await paginateQuery(
    req.query as any,
    findProgramsForUser,
    req.user?.id!
  );
  return res.json({ code: 200, result, hasMore });
});
