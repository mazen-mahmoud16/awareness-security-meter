import { Request } from "express";
import { Model } from "mongoose";
import asyncHandler from "./asyncHandler";
import { queryToNumber } from "./toNumber";

interface PaginationOptions {
  model: Model<any, {}, {}, any>;
  select?: string;
  filterFn?(req: Request): Object;
  transformResult?(res: any): any;
  populate?: { path: string; select: string };
}

const paginate = ({
  model,
  select,
  filterFn,
  transformResult,
  populate,
}: PaginationOptions) =>
  asyncHandler(async (req, res) => {
    queryToNumber(["take", "skip"])(req, res, async () => {
      var { take, skip, search } = req.query as any;
      take = take || 10;
      skip = skip || 0;
      var hasMore = false;
      var filter = search ? { $text: { $search: search } } : {};
      if (filterFn) filter = { ...filter, ...filterFn(req) };
      var result = await model
        .find(filter)
        .skip(skip)
        .limit(take + 1)
        .select(select ? select : "")
        .populate(populate?.path ?? "", populate?.select ?? "");

      if (result.length > take) {
        hasMore = true;
        result.pop();
      }

      result = transformResult ? transformResult(result) : result;

      const count = await model.count(filter);

      return res.json({
        code: 200,
        result,
        count,
        hasMore,
      });
    });
  });

export default paginate;
