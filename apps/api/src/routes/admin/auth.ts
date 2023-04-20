import { Router } from "express";
import { login, me, signOut } from "../../controllers/admin/auth";
import authenticate from "../../lib/middlewares/authentication/authenticateAdmin";
import validate from "../../lib/middlewares/validate";
import { LoginSchema } from "../../validation/admin/auth";

const router = Router();

router.post("/login", validate(LoginSchema), login);

router.use(authenticate);

router.get("/me", me);
router.post("/sign-out", signOut);

export default router;
