import express from "express";
import {
  localLogin,
  localRegister,
  localToken,
  verifyOtp,
} from "../../controllers/auth/local";
import validate from "../../lib/middlewares/validate";
import {
  GenerateTokenSchema,
  LoginSchema,
  RegisterSchema,
  VerifyTokenSchema,
} from "../../validation/localAuth";

const router = express.Router();

router.post("/login", validate(LoginSchema), localLogin);
router.post("/token", validate(GenerateTokenSchema), localToken);
router.post("/verify", validate(VerifyTokenSchema), verifyOtp);
router.post("/register", validate(RegisterSchema), localRegister);

export default router;
