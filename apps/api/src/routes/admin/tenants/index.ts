import { Router } from "express";
import {
  createTenant,
  deleteTenant,
  departments,
  editTenant,
  tenant,
  tenantNames,
  tenants,
} from "../../../controllers/admin/tenants";
import validate from "../../../lib/middlewares/validate";
import {
  EditTenantSchema,
  TenantSchema,
} from "../../../validation/admin/tenant";
import modules from "./modules";
import programs from "./programs";
import stats from "./stats";
import users from "./users";

const router = Router();

router.get("/", tenants);
router.get("/names", tenantNames);
router.get("/:id", tenant);
router.post("/", validate(TenantSchema), createTenant);
router.put("/:id", validate(EditTenantSchema), editTenant);
router.delete("/:id", deleteTenant);

router.get("/:id/departments", departments);

router.use("/:id/users/", users);
router.use("/:id/modules/", modules);
router.use("/:id/programs/", programs);
router.use("/:id/stats/", stats);

export default router;
