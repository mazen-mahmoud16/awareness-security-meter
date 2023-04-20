import express from "express";
import {
  avgScore,
  recentModules,
  recentPrograms,
} from "../../controllers/stats";

const router = express.Router();

router.get("/avgScore", avgScore);
router.get("/modules", recentModules);
router.get("/programs", recentPrograms);

export default router;
