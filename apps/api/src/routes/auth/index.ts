import express from "express";
import { me, signOut, whoami } from "../../controllers/auth";
import authenticate from "../../lib/middlewares/authentication/authenticate";
import validate from "../../lib/middlewares/validate";
import { WhoAmISchema } from "../../validation";
import google from "./google";
import local from "./local";
import microsoft from "./microsoft";
import microsoftSaml from "./microsoft-saml";

const router = express.Router();

router.use("/microsoft", microsoft);
router.use("/microsoft-saml", microsoftSaml);
router.use("/google", google);

router.use(express.json());

router.use("/local", local);

router.post("/whoami", validate(WhoAmISchema), whoami);

router.use(authenticate);

router.get("/me", me);
router.post("/sign-out", signOut);

export default router;
