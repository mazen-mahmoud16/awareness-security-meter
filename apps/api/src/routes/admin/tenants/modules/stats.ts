import { Router } from "express";
import {
  avgScoreForModule,
  deleteModuleSession,
  topUsersForModule,
} from "../../../../controllers/admin/tenants/modules";

const router = Router({ mergeParams: true });

router.get("/avgScore", avgScoreForModule);
router.get("/topUsers", topUsersForModule);
router.delete("/deleteUser/:uid", deleteModuleSession);

export default router;
