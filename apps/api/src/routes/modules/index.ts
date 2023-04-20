import express from "express";
import { module, moduleImage, modules } from "../../controllers/modules";
import checkModuleAccess from "../../lib/middlewares/authorization/checkModuleAccesss";
import streamImage from "../../lib/middlewares/streamImage";
import { queryToNumber } from "../../lib/middlewares/toNumber";
import session from "./session";

const router = express.Router();

router.get("/", queryToNumber(["type"]), modules);
router.get(
  "/:id",
  checkModuleAccess({
    exclude: [
      "content",
      "thumbnailImage",
      "coverImage",
      "_id",
      "tenantModule",
      "programs",
      "__v",
    ],
  }),
  module
);
router.get(
  "/:id/thumbnail",
  checkModuleAccess(),
  moduleImage("thumbnailImage"),
  streamImage
);
router.get(
  "/:id/cover",
  checkModuleAccess(),
  moduleImage("coverImage"),
  streamImage
);

router.use("/:id/session", session);

export default router;
