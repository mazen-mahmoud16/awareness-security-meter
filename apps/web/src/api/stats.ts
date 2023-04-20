import axios from "axios";
import {
  generatePaginatedQueryKey,
  PaginatedParams,
  PaginatedResponse,
  paginatedUrl,
  Response,
} from ".";
import { Module } from "./module";
import { Program } from "./program";

export const avgScore = async (): Promise<Response<number>> => {
  return (await axios.get(`/dashboard/avgScore`)).data;
};

export const avgScoreQuery = () => ({
  queryKey: ["average-score"],
  queryFn: async () => await avgScore(),
});

export const recentModules = async (
  pagination: PaginatedParams
): Promise<
  PaginatedResponse<
    (Module & {
      isCompleted: boolean;
      start: string;
      end: string;
      score?: number;
    })[]
  >
> => {
  return (await axios.get(paginatedUrl(`/dashboard/modules`, pagination))).data;
};

export const recentModulesQuery = (pagination: PaginatedParams) => ({
  queryKey: generatePaginatedQueryKey(["modules", "stats"], pagination),
  queryFn: async () => await recentModules(pagination),
  keepPreviousData: true,
});

export const recentPrograms = async (
  pagination: PaginatedParams
): Promise<PaginatedResponse<(Program & { progress: number })[]>> => {
  return (await axios.get(paginatedUrl(`/dashboard/programs`, pagination)))
    .data;
};

export const recentProgramsQuery = (pagination: PaginatedParams) => ({
  queryKey: generatePaginatedQueryKey(["programs", "stats"], pagination),
  queryFn: async () => await recentPrograms(pagination),
  keepPreviousData: true,
});
