import { Router } from "express";
import {
  deleteTenantModule,
  editTenantModule,
  exposeModule,
  module,
  moduleNames,
  modules,
} from "../../../../controllers/admin/tenants/modules";
import validate from "../../../../lib/middlewares/validate";
import stats from "./stats";
import { CreateTenantModuleSchema } from "../../../../validation/admin/tenantModule";

const router = Router({ mergeParams: true });

router.get("/", modules);
router.post("/names", moduleNames);
router.get("/:mid", module);
router.put("/:mid", editTenantModule);
router.post("/", validate(CreateTenantModuleSchema), exposeModule);
router.delete("/:mid", deleteTenantModule);

router.use("/:mid/stats", stats);

export default router;
