import { Router, json } from "express";
import authenticate from "../../lib/middlewares/authentication/authenticateAdmin";
import auth from "./auth";
import tenants from "./tenants";
import meta from "./meta";
import content from "./content";
import upload from "./upload";
import modules from "./modules";
import programs from "./programs";

const router = Router();

router.use(json());

router.use("/auth", auth);

router.use(authenticate);

router.use("/tenants", tenants);
router.use("/meta", meta);
router.use("/content", content);
router.use("/upload", upload);
router.use("/modules", modules);
router.use("/programs", programs);

export default router;
