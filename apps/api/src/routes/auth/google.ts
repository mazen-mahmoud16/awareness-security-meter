import express from "express";
import passport from "passport";
import { handler } from "../../controllers/auth";

const router = express.Router();

router.get(
  "/login",
  passport.authenticate("google", {
    scope: ["email"],
  }),
  (req, res) => {
    res.redirect("/");
  }
);
router.get("/callback", async (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    handler(req, res, next, err, user, info);
  })(req, res, next);
});

export default router;
