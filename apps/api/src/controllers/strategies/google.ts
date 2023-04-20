import passport from "passport";
import { CALLBACK_CLIENT_URL } from "../../lib/constants";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../../models/user";

// Google Login
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID! || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET! || "",
      callbackURL: `${process.env.AUTH_CALLBACK_URL}/google/callback`,
      scope: ["email"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      const user = await UserModel.findOne({
        email: { email: new RegExp(profile?._json?.email!, "i") },
      }).populate("tenant", { match: { provider: "google" } });

      if (!user) return cb("No User Found");

      return cb(null, user);
    }
  )
);
