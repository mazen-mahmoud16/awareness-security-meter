import { HttpError } from "../../../lib/error/HttpError";
import logger from "../../../lib/logger";
import asyncHandler from "../../../lib/middlewares/asyncHandler";
import checkAssessmentTime from "../../../lib/middlewares/authorization/checkAssessmentTime";
import {
  AssessmentModule,
  AssessmentSessionContent,
  Module,
  ModuleSession,
  ModuleType,
  User,
} from "../../../models";
import {
  completeAssessment,
  completePresentation,
  completeVideo,
  getQuestions,
  startAssessment,
  startPresentation,
  startVideo,
} from "../../../services/module/session";

export const startSession = asyncHandler(async (req, res) => {
  var result: any;

  const args: [Module, ModuleSession, User] = [
    req.module,
    req.moduleSession,
    req.user!,
  ];

  switch (req.module.type) {
    case ModuleType.Assessment:
      return checkAssessmentTime(req, res, async () => {
        return res.json({
          result: await startAssessment(...args),
          code: 200,
        });
      });
    case ModuleType.Video:
      result = await startVideo(...args);
      break;
    case ModuleType.Presentation:
      result = await startPresentation(...args);
      break;
    default:
      throw new HttpError(500, "Invalid Module Type");
  }

  logger.info({
    message: `Module Started`,
    code: 3,
    user: req.user?.id,
    module: req.module.id,
  });

  return res.json({
    code: 200,
    result,
  });
});

export const completeSession = asyncHandler(async (req, res) => {
  var result: { score?: number };
  switch (req.module.type) {
    case ModuleType.Assessment:
      return checkAssessmentTime(req, res, async () => {
        result = await completeAssessment(req.module, req.moduleSession);
        logger.info({
          message: `Module Completed`,
          code: 4,
          user: req.user?.id,
          module: req.module.id,
        });
        return res.json({ code: 200, result });
      });
    case ModuleType.Video:
      result = await completeVideo(req.moduleSession);
      break;
    case ModuleType.Presentation:
      result = await completePresentation(req.module, req.moduleSession);
      break;
    default:
      throw new HttpError(500, "Invalid Module Type");
  }

  logger.info({
    message: `Module Completed`,
    code: 4,
    user: req.user?.id,
    module: req.module.id,
  });

  return res.json({
    code: 200,
    result,
  });
});

export const getSessionResults = asyncHandler(async (req, res) => {
  if (!req.moduleSession?.isCompleted) {
    return res.json({ statusCode: 400, message: "Not Completed" });
  }

  switch (req.module.type) {
    case ModuleType.Assessment:
      const questions = getQuestions(
        (req.moduleSession.content as AssessmentSessionContent)
          .questions as any,
        (req.module.content as AssessmentModule["content"]).questions,
        req.module.id
      );
      return res.json({
        code: 200,
        result: {
          questions,
          answers: req.moduleSession.content?.answers,
          score: parseFloat(req.moduleSession.result?.score.toFixed(2) || "0"),
        },
      });
      break;

    default:
      return res.json({ code: 200 });
      break;
  }
});
