import express from "express";
import { logo } from "../../controllers/tenant";
import streamImage from "../../lib/middlewares/streamImage";

const router = express.Router();

router.get("/logo", logo("light"), streamImage);
router.get("/darkLogo", logo("dark"), streamImage);

export default router;
