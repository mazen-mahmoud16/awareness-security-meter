import axios from "axios";
import { Response } from "../..";

export const answerQuestion = async (
  id: string,
  question: string,
  answers: number[]
): Promise<Response> => {
  return (
    await axios.post(`/modules/${id}/session/assessment/answer/${question}`, {
      answers,
    })
  ).data;
};

export const goToQuestion = async (
  id: string,
  question: string
): Promise<Response> => {
  return (await axios.post(`/modules/${id}/session/assessment/go/${question}`))
    .data;
};
