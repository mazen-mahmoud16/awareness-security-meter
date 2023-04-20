import { Router } from "express";
import {
  avgScoreForUser,
  modulesForUser,
  programsForUser,
} from "../../../../controllers/admin/tenants/users";

const router = Router({ mergeParams: true });

router.get("/avgScore", avgScoreForUser);
router.get("/modules", modulesForUser);
router.get("/programs", programsForUser);

export default router;
