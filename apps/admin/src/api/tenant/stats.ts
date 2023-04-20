import axios from "axios";
import {
  generatePaginatedQueryKey,
  PaginatedParams,
  PaginatedResponse,
  paginatedUrl,
  Response,
} from "..";
import { Module } from "../module";
import { Program } from "../program";
import { User } from "./user";

// Tenant Queries
export const tenantAvgScore = async (
  tenant: string
): Promise<Response<number>> => {
  return (await axios.get(`/admin/tenants/${tenant}/stats/avgScore`)).data;
};

export const tenantAvgScoreQuery = (tenant: string) => ({
  queryKey: ["tenant", "score"],
  queryFn: async () => await tenantAvgScore(tenant),
});

// User Queries
export const userAvgScore = async (
  uid: string,
  tenant: string
): Promise<Response<number>> => {
  return (
    await axios.get(`/admin/tenants/${tenant}/users/${uid}/stats/avgScore`)
  ).data;
};

export const userAvgScoreQuery = (id: string, uid: string) => ({
  queryKey: ["users", "score", uid],
  queryFn: async () => await userAvgScore(id, uid),
});

export const userModules = async (
  uid: string,
  tenant: string,
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
  return (
    await axios.get(
      paginatedUrl(
        `/admin/tenants/${tenant}/users/${uid}/stats/modules`,
        pagination
      )
    )
  ).data;
};

export const userModulesQuery = (
  uid: string,
  tenant: string,
  pagination: PaginatedParams
) => ({
  queryKey: generatePaginatedQueryKey(["users", "modules", uid], pagination),
  queryFn: async () => await userModules(uid, tenant, pagination),
  keepPreviousData: true,
});

export const userPrograms = async (
  uid: string,
  tenant: string,
  pagination: PaginatedParams
): Promise<
  PaginatedResponse<
    (Program & {
      progress: number;
      length: number;
      start: string;
      end: string;
      isCompleted: boolean;
    })[]
  >
> => {
  return (
    await axios.get(
      paginatedUrl(
        `/admin/tenants/${tenant}/users/${uid}/stats/programs`,
        pagination
      )
    )
  ).data;
};

export const userProgramsQuery = (
  uid: string,
  tenant: string,
  pagination: PaginatedParams
) => ({
  queryKey: generatePaginatedQueryKey(["users", "program", uid], pagination),
  queryFn: async () => await userPrograms(uid, tenant, pagination),
  keepPreviousData: true,
});

// Module Queries
export const moduleAvgScore = async (
  mid: string,
  tenant: string
): Promise<Response<number>> => {
  return (
    await axios.get(`/admin/tenants/${tenant}/modules/${mid}/stats/avgScore`)
  ).data;
};

export const moduleAvgScoreQuery = (mid: string, tenant: string) => ({
  queryKey: ["modules", "score", mid],
  queryFn: async () => await moduleAvgScore(mid, tenant),
});

export const moduleUsers = async (
  module: string,
  tenant: string,
  pagination: PaginatedParams
): Promise<
  PaginatedResponse<
    (User & {
      isCompleted: boolean;
      score: number;
      end: string;
      start: string;
      moduleSessionId: string;
    })[]
  >
> => {
  return (
    await axios.get(
      paginatedUrl(
        `/admin/tenants/${tenant}/modules/${module}/stats/topUsers`,
        pagination
      )
    )
  ).data;
};

export const moduleUsersQuery = (
  module: string,
  tenant: string,
  pagination: PaginatedParams
) => ({
  queryKey: generatePaginatedQueryKey(
    ["modules", "users", module, tenant],
    pagination
  ),
  queryFn: async () => await moduleUsers(module, tenant, pagination),
  keepPreviousData: true,
});

export const deleteModuleSession = async (
  module: string,
  user: string,
  tenant: string
) => {
  await axios.delete(
    `/admin/tenants/${tenant}/modules/${module}/stats/deleteUser/${user}`
  );
};

export const deleteProgramSession = async (
  program: string,
  user: string,
  tenant: string
) => {
  await axios.delete(
    `/admin/tenants/${tenant}/programs/${program}/stats/deleteUser/${user}`
  );
};

export const programUsers = async (
  program: string,
  tenant: string,
  pagination: PaginatedParams
): Promise<
  PaginatedResponse<
    (User & {
      isCompleted: boolean;
      score: number;
      end: string;
      start: string;
      programSessionId: string;
    })[]
  >
> => {
  return (
    await axios.get(
      paginatedUrl(
        `/admin/tenants/${tenant}/programs/${program}/stats/users`,
        pagination
      )
    )
  ).data;
};

export const programUsersQuery = (
  program: string,
  tenant: string,
  pagination: PaginatedParams
) => ({
  queryKey: generatePaginatedQueryKey(
    ["programs", "users", program, tenant],
    pagination
  ),
  queryFn: async () => await programUsers(program, tenant, pagination),
  keepPreviousData: true,
});
