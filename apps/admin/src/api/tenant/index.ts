import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  generatePaginatedQueryKey,
  PaginatedParams,
  PaginatedResponse,
  paginatedUrl,
  Response,
} from "..";

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  provider: string;
  departments: string[];
  logo: string;
  darkLogo: string;
  lockToDomain?: boolean;
}

export interface TenantInput {
  name: string;
  domain: string;
  logo?: string;
  darkLogo?: string;
  lockToDomain?: boolean;
}

export interface EditTenantInput {
  name?: string;
  logo?: string;
  darkLogo?: string;
  departments?: string[];
  lockToDomain?: boolean;
}

export type TenantsResponse = PaginatedResponse<Tenant[]>;
export type TenantNamesResponse = PaginatedResponse<
  { name: string; id: string }[]
>;
export type CreateTenantResponse = Response<{ id: string }>;
export type TenantResponse = Response<Tenant>;

export const tenants = async (
  params: PaginatedParams
): Promise<TenantsResponse> => {
  return (await axios.get(paginatedUrl(`/admin/tenants`, params))).data;
};

export const tenantNames = async (): Promise<TenantNamesResponse> => {
  return (await axios.get(`/admin/tenants/names`)).data;
};

export const tenant = async (id: string): Promise<TenantResponse> => {
  return (await axios.get(`/admin/tenants/${id}`)).data;
};

export const createTenant = async (
  input: TenantInput
): Promise<CreateTenantResponse> => {
  return (await axios.post(`/admin/tenants`, input)).data;
};

export const editTenant = async (
  id: string,
  input: Partial<EditTenantInput>
): Promise<CreateTenantResponse> => {
  return (await axios.put(`/admin/tenants/${id}`, input)).data;
};

export const deleteTenant = async (id: string): Promise<Response> => {
  return (await axios.delete(`/admin/tenants/${id}`)).data;
};

export const deleteUsers = async (id: string): Promise<Response> => {
  return (await axios.delete(`/admin/tenants/${id}/users/`)).data;
};

export const tenantQuery = (id: string) => ({
  queryKey: ["tenant", id],
  queryFn: async () => await tenant(id),
});

export const tenantLoader =
  (queryClient: QueryClient, id: string) => async () => {
    const query = tenantQuery(id);
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export const tenantsQuery = (
  params: PaginatedParams = { skip: 0, take: 10 }
) => ({
  queryKey: generatePaginatedQueryKey(["tenants"], params),
  queryFn: async () => await tenants(params),
});

export const tenantNamesQuery = () => ({
  queryKey: ["tenant-names"],
  queryFn: tenantNames,
});
