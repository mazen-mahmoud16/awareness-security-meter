import axios from "axios";
import { Response } from ".";
import type { IUser } from "../stores/user";

export type IMeResponse = Response<IUser>;

export const me = async (): Promise<IMeResponse> => {
  return (await axios.get("/auth/me")).data;
};

export type ILoginResponse = Response<{
  redirect: string;
  isNew: boolean;
  provider: string;
  email: string;
}>;

export interface WhoAmIParams {
  email: string;
}

export const whoami = async (params: WhoAmIParams): Promise<ILoginResponse> => {
  return (await axios.post("/auth/whoami", params)).data;
};

export const signOut = async (): Promise<Response> => {
  return (await axios.post("/auth/sign-out")).data;
};

export const generateToken = async (email: string): Promise<Response> => {
  return (await axios.post("/auth/local/token", { email })).data;
};

export const verifyToken = async (
  email: string,
  token: string
): Promise<Response> => {
  return (await axios.post("/auth/local/verify", { email, token })).data;
};

export const register = async (
  email: string,
  password: string,
  token: string
): Promise<Response> => {
  return (await axios.post("/auth/local/register", { email, password, token }))
    .data;
};

export const localLogin = async (
  email: string,
  password: string
): Promise<Response> => {
  return (await axios.post("/auth/local/login", { email, password })).data;
};
