import axios from "axios";
import { Tenant } from ".";
import {
  generatePaginatedQueryKey,
  PaginatedParams,
  PaginatedResponse,
  paginatedUrl,
  Response,
} from "..";
import { Program } from "../program";

export interface TenantProgramInput {
  program: string;
  tenant: string;
  deadlines: { department: string; deadline?: Date }[];
  showInLibrary?: boolean;
  showModulesInLibrary?: boolean;
  disabled?: boolean;
}

export interface TenantProgram {
  id: string;
  program: Program;
  tenant: Tenant;
  deadlines: { department: string; deadline?: Date }[];
  showInLibrary?: boolean;
  showModulesInLibrary?: boolean;
  disabled?: boolean;
}

type TenantProgramsResponse = PaginatedResponse<TenantProgram[]>;
type TenantProgramResponse = Response<TenantProgram>;

export const tenantPrograms = async (
  id: string,
  params: PaginatedParams
): Promise<TenantProgramsResponse> => {
  return (
    await axios.get(paginatedUrl(`/admin/tenants/${id}/programs`, params))
  ).data;
};

export const tenantProgramsQuery = (
  id: string,
  params: PaginatedParams = { skip: 0, take: 10 }
) => ({
  queryKey: generatePaginatedQueryKey(["tenant-programs", id], params),
  queryFn: async () => await tenantPrograms(id, params),
  keepPreviousData: true,
});

export const tenantProgram = async (
  tId: string,
  id: string
): Promise<TenantProgramResponse> => {
  return (await axios.get(`/admin/tenants/${tId}/programs/${id}`)).data;
};

export const tenantProgramQuery = (tId: string, id: string) => ({
  queryKey: ["tenant-program", tId, id],
  queryFn: async () => await tenantProgram(tId, id),
});

export const createTenantProgram = async (
  id: string,
  input: TenantProgramInput
): Promise<Response> => {
  return (await axios.post(`/admin/tenants/${id}/programs`, input)).data;
};

export const editTenantProgram = async (
  tId: string,
  mId: string,
  input: Partial<TenantProgramInput>
): Promise<Response> => {
  return (await axios.put(`/admin/tenants/${tId}/programs/${mId}`, input)).data;
};

export const deleteTenantProgram = async (
  tId: string,
  mId: string
): Promise<Response> => {
  return (await axios.delete(`/admin/tenants/${tId}/programs/${mId}`)).data;
};
