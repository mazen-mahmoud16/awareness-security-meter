import { Router } from "express";
import {
  avgScoreForTenant,
  generateReportForTenant,
} from "../../../controllers/admin/tenants/stats";

const router = Router({ mergeParams: true });

router.get("/avgScore", avgScoreForTenant);
router.get("/report", generateReportForTenant);

export default router;
