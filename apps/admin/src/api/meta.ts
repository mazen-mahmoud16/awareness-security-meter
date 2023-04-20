import axios from "axios";
import { Response } from ".";

export type ProvidersResponse = Response<string[]>;

export const providers = async (): Promise<ProvidersResponse> => {
  return (await axios.get(`/admin/meta/providers`)).data;
};

export const providersQuery = () => ({
  queryKey: ["authentication-providers"],
  queryFn: providers,
});
