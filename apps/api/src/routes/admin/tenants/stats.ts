import { Router } from "express";
import {
  avgScoreForTenant,
  getReportForTenant,
} from "../../../controllers/admin/tenants/stats";

const router = Router({ mergeParams: true });

router.get("/avgScore", avgScoreForTenant);
router.get("/reports/:rid", getReportForTenant);

export default router;
