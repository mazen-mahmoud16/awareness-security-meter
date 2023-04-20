import axios from "axios";
import { Response } from "..";

export type SessionInfoResponse = Response<{ module: string }>;

export const startSession = async (
  id: string
): Promise<SessionInfoResponse> => {
  return (await axios.post(`/programs/${id}/session/start`)).data;
};

export const nextModule = async (id: string): Promise<Response> => {
  return (await axios.post(`/programs/${id}/session/next`)).data;
};
