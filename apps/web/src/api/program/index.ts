import axios from "axios";
import {
  generatePaginatedQueryKey,
  PaginatedParams,
  PaginatedResponse,
  paginatedUrl,
  Response,
} from "..";
import { Module, ModulesResponse } from "../module";

export interface Program {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  thumbnailImage: string;
  slug: string;
  isCompleted: boolean;
  modules: Module[];
  length: number;
  progress?: number;
}

export type ProgramsResponse = PaginatedResponse<Program[]>;
export type ProgramResponse = Response<Program>;

export const programs = async (
  params: PaginatedParams
): Promise<ProgramsResponse> => {
  return (await axios.get(paginatedUrl("/programs", params))).data;
};

export const programsQuery = (params: PaginatedParams) => ({
  queryKey: generatePaginatedQueryKey(["programs"], params),
  queryFn: async () => await programs(params),
  keepPreviousData: true,
});

export const program = async (slug: string): Promise<ProgramResponse> => {
  return (await axios.get(`/programs/${slug}`)).data;
};

export const programQuery = (slug: string) => ({
  queryKey: ["program", slug],
  queryFn: async () => await program(slug),
});

export const programModules = async (
  slug: string
): Promise<ModulesResponse> => {
  return (await axios.get(`/programs/${slug}/modules`)).data;
};

export const programModulesQuery = (slug: string) => ({
  queryKey: ["program", slug, "modules"],
  queryFn: async () => await programModules(slug),
});
