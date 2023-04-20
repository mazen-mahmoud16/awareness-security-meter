import {
  findAverageScoreForUser,
  findModulesForUser,
  findProgramsForUser,
} from "../../../services/stats";
import { router, userProcedure } from "../../trpc";
import { PaginationSchema } from "../../../validation";

export const homeRouter = router({
  avgScore: userProcedure.query(async ({ ctx, input }) => {
    return await findAverageScoreForUser(ctx.session.user.id);
  }),
  recentModules: userProcedure
    .input(PaginationSchema)
    .query(async ({ ctx, input }) => {
      var hasMore = false;
      const modules = await findModulesForUser(ctx.session.user.id, input);

      if (modules.length > input.take) {
        hasMore = true;
        modules.pop();
      }

      return { modules, hasMore };
    }),
  recentPrograms: userProcedure
    .input(PaginationSchema)
    .query(async ({ ctx, input }) => {
      const programs = await findProgramsForUser(ctx.session.user.id);

      return programs;
    }),
});
