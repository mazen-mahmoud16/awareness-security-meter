import { restartableModules } from "../../../models";
import { findSession } from "../../../services/module/session";
import { HttpError } from "../../error/HttpError";
import asyncHandler from "../asyncHandler";

import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      retriesLeft?: number;
    }
  }
}

const checkModuleSession = (options?: {
  allowCompleted?: boolean;
  exclude?: string[];
}) =>
  asyncHandler(async (req, res, next) => {
    var session = await findSession(req.user?.id!, req.module.id, {
      exclude: options?.exclude,
    });
    if (session?.isCompleted === true && !options?.allowCompleted) {
      if (!restartableModules.includes(req.module.type!))
        if(session.retriesLeft && session.retriesLeft<=0)
          throw new HttpError(400, "Already Completed");
        else{
          if(session.content && session.retriesLeft){
            req.retriesLeft = session.retriesLeft;
          }
          await session.deleteOne();
          session = null
        }
    }
    if (session) {
      req.moduleSession = session;
    }
    return next();
  });

export default checkModuleSession;
