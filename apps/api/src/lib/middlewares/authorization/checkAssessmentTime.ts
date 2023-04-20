import { AssessmentModule, AssessmentSessionContent } from "../../../models";
import { completeAssessment } from "../../../services/module/session";
import { HttpError } from "../../error/HttpError";
import asyncHandler from "../asyncHandler";

const checkAssessmentTime = asyncHandler(async (req, res, next) => {
  const moduleContent = req.module.content as AssessmentModule["content"];
  const moduleSession = req.moduleSession;

  if (moduleSession.isCompleted) {
    return res.json({
      code: 200,
      result: { score: moduleSession.result?.score },
    });
  }

  if (
    moduleContent.maxTime === undefined ||
    !moduleSession.start ||
    !moduleSession
  )
    return next();

  const diff =
    new Date(new Date().getTime() - moduleSession.start.getTime()).getTime() /
    1000;

  if (diff < moduleContent.maxTime) {
    return next();
  }

  const session = moduleSession.content as AssessmentSessionContent;

  // Filling in the blanks
  session.answers = session.answers.map((a) => {
    if (!Array.isArray(a)) {
      return [-1];
    } else return a;
  });

  const lengthDiff = session.questions.length - session.answers.length;

  if (lengthDiff !== 0) {
    for (var i = 0; i < lengthDiff; i++) {
      session.answers.push([-1]);
    }
  }

  moduleSession.markModified("content");
  await moduleSession.save();

  try {
    await completeAssessment(req.module, moduleSession);
  } catch (e) {
    throw new HttpError(500, "An Error Occured While Completing Assessment");
  }

  throw new HttpError(400, "Assessment time expired");
});

export default checkAssessmentTime;
