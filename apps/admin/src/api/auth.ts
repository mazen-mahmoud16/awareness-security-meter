import axios from "axios";
import { Response } from ".";
import type { IAdmin } from "../atoms/user";

export type IMeResponse = Response<IAdmin>;

export const me = async (): Promise<IMeResponse> => {
  return (await axios.get("/admin/auth/me")).data;
};

export type ILoginResponse = Response<{ token: string; user: IAdmin }>;

export interface LoginParams {
  email: string;
  password: string;
}

export const login = async (params: LoginParams): Promise<ILoginResponse> => {
  return (await axios.post("/admin/auth/login", params)).data;
};

export const signOut = async (): Promise<Response> => {
  return (await axios.post("/admin/auth/sign-out")).data;
};
