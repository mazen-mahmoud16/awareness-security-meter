import express from "express";
import {
  createModule,
  deleteModule,
  editModule,
  module,
  moduleNames,
  modules,
} from "../../controllers/admin/modules";
import validate from "../../lib/middlewares/validate";
import { CreateModuleSchema } from "../../validation/admin/module";

const router = express.Router();

router.post("/filter", modules);
router.get("/names", moduleNames);
router.get("/:id", module);
router.post("/", validate(CreateModuleSchema), createModule);
router.put("/:id", validate(CreateModuleSchema.partial()), editModule);
router.delete("/:id", deleteModule);

export default router;
