import { HttpError } from "../../../lib/error/HttpError";
import asyncHandler from "../../../lib/middlewares/asyncHandler";
import getShuffledArr from "../../../lib/util/getShuffledArray";
import { AssessmentModule, ModuleType } from "../../../models";
import ModuleSessionModel from "../../../models/module/session";

export const startPresentation = asyncHandler(async (req, res) => {
  if (req.moduleSession.end)
    throw new HttpError(400, ["Module Already Complete"]);
  if (req.moduleSession) throw new HttpError(400, "Module Already Started");

  const module: AssessmentModule = req.module;

  var questions = module.content.questions;

  if (module.content.isRandom) questions = getShuffledArr(questions);
  if (module.content.numberOfQuestions)
    questions = questions.slice(0, module.content.numberOfQuestions);

  const session = await ModuleSessionModel.create({
    module: req.module.id,
    user: req.user?.id,
    type: ModuleType.Assessment,
    start: new Date(),
    content: { questions, question: 0, answers: [] },
  });

  return res.json({ code: 200, result: session.content });
});
