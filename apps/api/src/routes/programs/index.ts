import express from "express";
import {
  modules,
  program,
  programImage,
  programs,
} from "../../controllers/programs";
import checkProgramAccess from "../../lib/middlewares/authorization/checkProgramAccess";
import streamImage from "../../lib/middlewares/streamImage";
import { queryToNumber } from "../../lib/middlewares/toNumber";
import session from "./session";

const router = express.Router();

router.get("/", queryToNumber(["take", "skip"]), programs);

router.get(
  "/:id",
  checkProgramAccess({ exclude: ["modules", "coverImage", "thumbnailImage"] }),
  program
);

router.get(
  "/:id/thumbnail",
  checkProgramAccess(),
  programImage("thumbnailImage"),
  streamImage
);
router.get(
  "/:id/cover",
  checkProgramAccess(),
  programImage("coverImage"),
  streamImage
);

router.get("/:id/modules", checkProgramAccess(), modules);

router.use("/:id/session", session);

export default router;
