import axios from "axios";
import { Tenant } from ".";
import {
  generatePaginatedQueryKey,
  PaginatedParams,
  PaginatedResponse,
  paginatedUrl,
  Response,
} from "..";
import { Module } from "../module";

export interface TenantModuleInput {
  module: string;
  tenant: string;
  deadlines: { department: string; deadline?: Date }[];
  showInLibrary?: boolean;
  disabled?: boolean;
}

export interface TenantModule {
  id: string;
  module: Module;
  tenant: Tenant;
  deadlines: { department: string; deadline?: Date }[];
  showInLibrary?: boolean;
  disabled?: boolean;
}

type TenantModulesResponse = PaginatedResponse<TenantModule[]>;
type TenantModuleResponse = Response<TenantModule>;

export const tenantModules = async (
  id: string,
  params: PaginatedParams
): Promise<TenantModulesResponse> => {
  return (await axios.get(paginatedUrl(`/admin/tenants/${id}/modules`, params)))
    .data;
};

export const tenantModulesQuery = (
  id: string,
  params: PaginatedParams = { skip: 0, take: 10 }
) => ({
  queryKey: generatePaginatedQueryKey(["tenant-modules", id], params),
  queryFn: async () => await tenantModules(id, params),
  keepPreviousData: true,
});

export const tenantModule = async (
  tId: string,
  id: string
): Promise<TenantModuleResponse> => {
  return (await axios.get(`/admin/tenants/${tId}/modules/${id}`)).data;
};

export const tenantModuleQuery = (tId: string, id: string) => ({
  queryKey: ["tenant-module", tId, id],
  queryFn: async () => await tenantModule(tId, id),
});

export const createTenantModule = async (
  id: string,
  input: TenantModuleInput
): Promise<Response> => {
  return (await axios.post(`/admin/tenants/${id}/modules`, input)).data;
};

export const editTenantModule = async (
  tId: string,
  mId: string,
  input: Partial<TenantModuleInput>
): Promise<Response> => {
  return (await axios.put(`/admin/tenants/${tId}/modules/${mId}`, input)).data;
};

export const deleteTenantModule = async (
  tId: string,
  mId: string
): Promise<Response> => {
  return (await axios.delete(`/admin/tenants/${tId}/modules/${mId}`)).data;
};
