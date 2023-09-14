import axios from "axios";
import {
  generatePaginatedQueryKey,
  PaginatedParams,
  PaginatedResponse,
  paginatedUrl,
  Response,
} from "..";
import { Question } from "./session";

export enum ModuleType {
  Assessment = 1,
  Video = 2,
  Presentation = 3,
}

export interface Module {
  id: string;
  name: string;
  description: string;
  type: ModuleType;
  duration: number;
  coverImage: string;
  thumbnailImage: string;
  isCompleted: boolean;
  slug: string;
  content: any;
  retriesLeft?: number;
}

export type ModulesResponse = PaginatedResponse<Module[]>;
export type ModuleResponse = Response<Module>;

export const modules = async (
  params: PaginatedParams,
  type?: ModuleType
): Promise<ModulesResponse> => {
  return (
    await axios.get(
      `${paginatedUrl("/modules", params)}${type ? `&type=${type}` : ""}`
    )
  ).data;
};

export const modulesQuery = (params: PaginatedParams, type?: ModuleType) => ({
  queryKey: generatePaginatedQueryKey(
    ["modules", type?.toString() || ""],
    params
  ),
  queryFn: async () => await modules(params, type),
  keepPreviousData: true,
});

export const module = async (slug: string): Promise<ModuleResponse> => {
  return (await axios.get(`/modules/${slug}`)).data;
};

export const moduleQuery = (
  slug: string,
  key: string[] = ["module", slug]
) => ({
  queryKey: key,
  queryFn: async () => await module(slug),
});

export interface ModuleResults {
  questions: Question[];
  answers: ((number | null)[] | null)[];
  score: number;
}

export const results = async (
  slug: string
): Promise<Response<ModuleResults>> => {
  return (await axios.get(`/modules/${slug}/session/results`)).data;
};

export const resultsQuery = (
  slug: string,
  key: string[] = ["module", "results", slug]
) => ({
  queryKey: key,
  queryFn: async () => await results(slug),
});
