import express from "express";
import { startPresentation } from "../../../controllers/modules/session/presentation";
import validate from "../../../lib/middlewares/validate";

const router = express.Router();

router.post("/", startPresentation);

export default router;
