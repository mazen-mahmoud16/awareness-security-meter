import zod from "zod";

export const AnswerQuestionSchema = zod.object({
  answers: zod.array(zod.number().int()).max(4),
});
