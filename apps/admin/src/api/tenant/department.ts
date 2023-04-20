import axios from "axios";
import { Response } from "..";

export const departments = async (id: string): Promise<Response<string[]>> => {
  return (await axios.get(`/admin/tenants/${id}/departments`)).data;
};

export const departmentsQuery = (id: string) => ({
  queryKey: ["departments", "tenant", id],
  queryFn: async () => await departments(id),
});
