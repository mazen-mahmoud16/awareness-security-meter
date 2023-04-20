import express, { json } from "express";
import authenticate from "../lib/middlewares/authentication/authenticate";
import admin from "./admin";
import auth from "./auth";
import modules from "./modules";
import programs from "./programs";
import tenant from "./tenant";
import dashboard from "./dashboard";

const router = express.Router();

router.use("/admin", admin);
router.use("/auth/", auth);

router.use(authenticate);

router.use(json());

router.use("/dashboard", dashboard);
router.use("/modules", modules);
router.use("/tenant", tenant);
router.use("/programs", programs);
// router.use("/settings");

export default router;
