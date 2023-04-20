import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { handler } from "../../controllers/auth";

const router = express.Router();

router.get(
  "/login",
  passport.authenticate("microsoft", {
    prompt: "select_account",
  })
);
router.get("/callback", async (req, res, next) => {
  passport.authenticate("microsoft", (err, user, info) => {
    handler(req, res, next, err, user, info);
  })(req, res, next);
});

export default router;
