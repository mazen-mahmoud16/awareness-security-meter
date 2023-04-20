import { QueryClient } from "@tanstack/react-query";

export interface Response<
  ResultType = any,
  ErrorType = string[] | { [key: string]: string }
> {
  code: number;
  result: ResultType;
  error: ErrorType;
}

export interface PaginatedResponse<
  ResultType = any,
  ErrorType = string[] | { [key: string]: string[] }
> extends Response<ResultType, ErrorType> {
  hasMore: boolean;
  count: number;
}

export interface PaginatedParams {
  skip: number;
  take: number;
  search?: string;
}

export const paginatedUrl = (
  base: string,
  { skip, take, search }: PaginatedParams
) => `${base}?skip=${skip}&take=${take}${search ? `&search=${search}` : ""}`;

export const generatePaginatedQueryKey = (
  base: string[],
  { skip, take, search }: PaginatedParams
) => [...base, skip, take, search];

export type QueryGenerator = (...args: any[]) => {
  queryKey: (string | number | undefined)[];
  queryFn: () => Promise<Response>;
};
