import axios from "axios";
import {
  generatePaginatedQueryKey,
  PaginatedParams,
  PaginatedResponse,
  paginatedUrl,
  Response,
} from ".";

export interface ProgramInput {
  name: string;
  description: string;
  duration: number;
  thumbnailImage?: string;
  coverImage?: string;
  tenant: string;
  modules: string[];
}

export interface Program extends ProgramInput {
  id: string;
}

export type ProgramsResponse = PaginatedResponse<Program[]>;
export type ProgramResponse = Response<Program>;

export const programs = async (
  params: PaginatedParams,
  tenant?: string
): Promise<ProgramsResponse> => {
  var body = tenant ? { tenant } : undefined;
  return (
    await axios.post(paginatedUrl(`/admin/programs/filter`, params), body)
  ).data;
};

export const programsQuery = (
  params: PaginatedParams = { skip: 0, take: 10 },
  tenant?: string
) => ({
  queryKey: [...generatePaginatedQueryKey(["programs"], params), tenant],
  queryFn: async () => await programs(params, tenant),
  keepPreviousData: true,
});

export type ProgramNamesResponse = PaginatedResponse<
  {
    id: string;
    name: string;
    type: string;
    thumbnailImage: string;
  }[]
>;

export const programNamesForTenant = async (
  params: PaginatedParams,
  tenant: string,
  tenantOnly: boolean
): Promise<ProgramNamesResponse> => {
  return (
    await axios.post(
      paginatedUrl(`/admin/tenants/${tenant}/programs/names`, params),
      { tenantOnly }
    )
  ).data;
};

export const programNamesForTenantQuery = (
  params: PaginatedParams = { skip: 0, take: 100 },
  tenant: string,
  tenantOnly: boolean
) => ({
  queryKey: [
    ...generatePaginatedQueryKey(["program-names"], params),
    tenant,
    tenantOnly,
  ],
  queryFn: async () => await programNamesForTenant(params, tenant, tenantOnly),
});

export const program = async (id: string): Promise<ProgramResponse> => {
  return (await axios.get(`/admin/programs/${id}`)).data;
};

export const programQuery = (id: string, enabled = true) => ({
  queryKey: ["program", id],
  queryFn: async () => await program(id),
  enabled,
});

export const createProgram = async (
  params: ProgramInput
): Promise<Response> => {
  return (await axios.post("/admin/programs", params)).data;
};

export const editProgram = async (
  id: string,
  params: Partial<ProgramInput>
): Promise<Response> => {
  return (await axios.put(`/admin/programs/${id}`, params)).data;
};

export const deleteProgram = async (id: string): Promise<Response> => {
  return (await axios.delete(`/admin/programs/${id}`)).data;
};
