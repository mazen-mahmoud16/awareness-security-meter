import axios from "axios";
import {
  generatePaginatedQueryKey,
  PaginatedParams,
  PaginatedResponse,
  paginatedUrl,
  Response,
} from "..";

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
}

export interface UserInput {
  name: string;
  email: string;
  department: string;
  authProvider?: string;
}

export type UserResponse = Response<User>;
export type UsersResponse = PaginatedResponse<User[]>;

export const users = async (
  id: string,
  params: PaginatedParams,
  department: string
): Promise<UsersResponse> => {
  return (
    await axios.get(
      `${paginatedUrl(
        `/admin/tenants/${id}/users`,
        params
      )}&department=${department}`
    )
  ).data;
};

export const user = async (id: string, uid: string): Promise<UserResponse> => {
  return (await axios.get(`/admin/tenants/${id}/users/${uid}`)).data;
};

export const createUser = async (id: string, input: UserInput) => {
  return (await axios.post(`/admin/tenants/${id}/users`, input)).data;
};

export const editUser = async (
  id: string,
  uid: string,
  input: Partial<UserInput>
) => {
  return (await axios.put(`/admin/tenants/${id}/users/${uid}`, input)).data;
};

export const deleteUser = async (id: string, uid: string) => {
  return (await axios.delete(`/admin/tenants/${id}/users/${uid}`)).data;
};

export const usersQuery = (
  id: string,
  params: PaginatedParams = { skip: 0, take: 10 },
  department: string = ""
) => ({
  queryKey: generatePaginatedQueryKey(["users", id, department], params),
  queryFn: async () => await users(id, params, department),
  keepPreviousData: true,
});

export const userQuery = (id: string, uid: string) => ({
  queryKey: ["users", id, uid],
  queryFn: async () => await user(id, uid),
});
