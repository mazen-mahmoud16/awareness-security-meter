import { Router } from "express";
import {
  deleteTenantProgram,
  editTenantProgram,
  exposeProgram,
  program,
  programNames,
  programs,
} from "../../../../controllers/admin/tenants/programs";
import validate from "../../../../lib/middlewares/validate";
import { CreateTenantProgramSchema } from "../../../../validation/admin/tenantProgram";
import stats from "./stats";

const router = Router({ mergeParams: true });

router.get("/", programs);
router.post("/names", programNames);
router.get("/:pid", program);
router.put("/:pid", editTenantProgram);
router.post("/", validate(CreateTenantProgramSchema), exposeProgram);
router.delete("/:pid", deleteTenantProgram);

router.use("/:pid/stats", stats);

export default router;
