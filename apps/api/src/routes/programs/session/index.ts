import express from "express";
import { next, start } from "../../../controllers/programs";
import checkProgramAccess from "../../../lib/middlewares/authorization/checkProgramAccess";

const router = express.Router({ mergeParams: true });

router.post("/start", checkProgramAccess(), start);
router.post("/next", checkProgramAccess(), next);

export default router;
