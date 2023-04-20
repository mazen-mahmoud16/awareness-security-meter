import {
  generatePaginatedQueryKey,
  PaginatedParams,
  PaginatedResponse,
  paginatedUrl,
  Response,
} from "../..";
import axios from "axios";
import { ModuleType } from "..";
import { moduleTypesNames } from "../../../utils/constants";

export interface Question {
  prompt: string;
  options: string[];
  id: string;
  image?: string;
  isMulti: boolean;
  answers: number[];
}

export interface AssessmentSession {
  questions: Question[];
  currentQuestion: number;
  answers: number[][];
  maxTime?: number;
  start: string;
}

export type SessionInfoResponse<T = AssessmentSession> = Response<T>;

export const startSession = async (
  id: string
): Promise<SessionInfoResponse> => {
  return (await axios.post(`/modules/${id}/session/start`)).data;
};

export type SessionCompletionResponse = Response<{ score: number }>;

export const completeSession = async (
  id: string
): Promise<SessionCompletionResponse> => {
  return (await axios.post(`/modules/${id}/session/complete`)).data;
};
