import { restartableModules } from "../../../models";
import { findSession } from "../../../services/module/session";
import { HttpError } from "../../error/HttpError";
import asyncHandler from "../asyncHandler";

const checkModuleSession = (options?: {
  allowCompleted?: boolean;
  exclude?: string[];
}) =>
  asyncHandler(async (req, res, next) => {
    const session = await findSession(req.user?.id!, req.module.id, {
      exclude: options?.exclude,
    });
    if (session?.isCompleted === true && !options?.allowCompleted) {
      if (!restartableModules.includes(req.module.type!))
        throw new HttpError(400, "Already Completed");
    }
    if (session) req.moduleSession = session;
    return next();
  });

export default checkModuleSession;
