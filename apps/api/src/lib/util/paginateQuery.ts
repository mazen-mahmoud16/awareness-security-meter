import { PaginationParams } from "../interfaces/PaginationParams";

const paginateQuery = async (
  { take, skip, search }: PaginationParams,
  fn: any,
  ...args: any[]
) => {
  skip = Number(skip) || 0;
  take = Number(take) || 10;
  var hasMore = false;

  var result = await fn(...args, { take: take + 1, search, skip });

  if (result.length > take) {
    hasMore = true;
    result.pop();
  }

  return { hasMore, result };
};

export default paginateQuery;
