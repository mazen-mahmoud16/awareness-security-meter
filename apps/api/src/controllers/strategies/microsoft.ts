import passport from "passport";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import { FAILURE_CLIENT_URL } from "../../lib/constants";
import { RedirectError } from "../../lib/error/RedirectError";
import { Tenant } from "../../models";
import UserModel, { User } from "../../models/user";

// Microsoft Login
// passport.use(
//   "microsoft",
//   new MicrosoftStrategy(
//     {
//       // Standard OAuth2 options
//       clientID: process.env.MICROSOFT_CLIENT_ID!,
//       clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
//       callbackURL: `${process.env.AUTH_CALLBACK_URL}/microsoft/callback`,
//       scope: ["user.read"],
//       // [Optional] The authorization URL. Defaults to `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`
//       authorizationURL:
//         "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
//       // [Optional] The token URL. Defaults to `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`
//       tokenURL: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
//     },
//     async function (
//       accessToken: string,
//       refreshToken: string,
//       profile: any,
//       done: (err?: Error | null, user?: User, info?: object) => void
//     ) {
//       if (!profile) {
//         return done(new RedirectError(FAILURE_CLIENT_URL) as unknown as Error);
//       }

//       const user = await UserModel.findOne({
//         email: profile.userPrincipalName,
//       }).populate({
//         path: "tenant",
//         match: { provider: "microsoft" },
//       });

//       if (!user) {
//         return done(new RedirectError(FAILURE_CLIENT_URL) as unknown as Error);
//       }

//       done(null, user);
//     }
//   )
// );
