import express from "express";
import {
  completeSession,
  startSession,
  getSessionResults,
} from "../../../controllers/modules/session";
import checkAssessmentTime from "../../../lib/middlewares/authorization/checkAssessmentTime";
import checkModuleAccess from "../../../lib/middlewares/authorization/checkModuleAccesss";
import checkModuleSession from "../../../lib/middlewares/authorization/checkModuleSession";
import { ModuleType } from "../../../models/module";
import assessment from "./assessment";
import presentation from "./presentation";
import video from "./video";

const router = express.Router({ mergeParams: true });

router.post(
  "/start",
  checkModuleAccess({ exclude: false }),
  checkModuleSession(),
  startSession
);
router.post(
  "/complete",
  checkModuleAccess({ exclude: false }),
  checkModuleSession({ allowCompleted: true }),
  completeSession
);

router.use(
  "/assessment",
  checkModuleAccess({ type: ModuleType.Assessment }),
  checkModuleSession(),
  checkAssessmentTime,
  assessment
);
router.use("/presentation", presentation);
router.use(
  "/video",
  checkModuleAccess({ type: ModuleType.Video }),
  checkModuleSession(),
  video
);

router.get(
  "/results",
  checkModuleAccess({ exclude: false }),
  checkModuleSession({ allowCompleted: true }),
  getSessionResults
);

export default router;
