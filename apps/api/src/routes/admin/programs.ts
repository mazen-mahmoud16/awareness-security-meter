import express from "express";
import {
  createProgram,
  deleteProgram,
  editProgram,
  program,
  programs,
} from "../../controllers/admin/programs";

import validate from "../../lib/middlewares/validate";
import {
  CreateProgramSchema,
  EditProgramSchema,
} from "../../validation/admin/program";

const router = express.Router();

router.post("/filter", programs);
router.get("/:id", program);

router.post("/", validate(CreateProgramSchema), createProgram);

router.put("/:id", validate(EditProgramSchema), editProgram);

router.delete("/:id", deleteProgram);

export default router;
