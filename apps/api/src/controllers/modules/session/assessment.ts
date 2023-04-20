import { HttpError } from "../../../lib/error/HttpError";
import asyncHandler from "../../../lib/middlewares/asyncHandler";
import { AssessmentModule } from "../../../models";
import ImageModel from "../../../models/content/image";

export const goToQuestion = asyncHandler(async (req, res) => {
  if (req.moduleSession.end)
    throw new HttpError(400, "Module Already Complete");

  const questionId = req.params.qId;
  const module: AssessmentModule = req.module;

  req.moduleSession.changeQuestion(questionId);
  await req.moduleSession.save();

  return res.json({
    code: 200,
    result: module.content.questions.find(
      (q) => q._id.toString() === questionId
    ),
  });
});

export const answerQuestion = asyncHandler(async (req, res) => {
  if (req.moduleSession.end)
    throw new HttpError(400, "Module Already Complete");

  const questionId = req.params.qId;
  const answers = req.body.answers;

  req.moduleSession.submitAssessmentQuestion(questionId, answers);
  await req.moduleSession.save();

  return res.json({ code: 200 });
});

export const questionImage = asyncHandler(async (req, res, next) => {
  if (req.moduleSession.end)
    throw new HttpError(400, "Module Already Complete");

  const content = req.module.content as AssessmentModule["content"];

  const question = content.questions.find(
    (q) => q._id.toString() === req.params.qId
  );

  if (!question) throw new HttpError(400, "Invalid Question");

  if (!question.image) throw new HttpError(400, "Question Doesn't have Image");

  const image = await ImageModel.findById(question.image);

  req.imageUrl = image?.path;

  next();
});
