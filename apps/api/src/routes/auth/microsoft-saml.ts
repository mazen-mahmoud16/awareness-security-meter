import express from "express";
import passport from "passport";
import { handler } from "../../controllers/auth";

const router = express.Router();

router.get("/login", passport.authenticate("microsoft-saml"), (req, res) => {
  res.redirect("/");
});
router.post(
  "/callback",
  express.urlencoded({ extended: false }),
  async (req, res, next) => {
    passport.authenticate("microsoft-saml", (err, user, info) => {
      handler(req, res, next, err, user, info);
    })(req, res, next);
  }
);

export default router;
