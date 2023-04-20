import passport from "passport";
import {
  MultiSamlStrategy,
  Strategy as SamlStrategy,
  VerifyWithRequest,
  type VerifyWithoutRequest,
} from "passport-saml";
import { FAILURE_CLIENT_URL } from "../../lib/constants";
import { RedirectError } from "../../lib/error/RedirectError";
import { Tenant } from "../../models";
import TenantAuthModel, {
  MicrosoftSAMLOptions,
  TenantAuth,
} from "../../models/tenant/tenant-auth";
import UserModel, { User } from "../../models/user";

// SAML Authentication
const handleSamlStrategy: VerifyWithRequest = async (req, profile, done) => {
  if (!profile) {
    return done(new RedirectError(FAILURE_CLIENT_URL) as unknown as Error);
  }

  const email = profile[
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
  ] as string;

  const user = await UserModel.findOne({ email: new RegExp(email, "i") })
    .populate<
      User & {
        tenant?: Tenant & { defaultProvider?: TenantAuth };
        authProvider?: TenantAuth;
      }
    >("authProvider")
    .populate({ path: "tenant", populate: { path: "defaultProvider" } });

  if (!user) {
    return done(new RedirectError(FAILURE_CLIENT_URL) as unknown as Error);
  }

  if (user?.authProvider) {
    if (user?.authProvider?.type !== "microsoft-saml") {
      return done(new RedirectError(FAILURE_CLIENT_URL) as unknown as Error);
    }
  } else {
    if (user?.tenant?.defaultProvider?.type !== "microsoft-saml") {
      return done(new RedirectError(FAILURE_CLIENT_URL) as unknown as Error);
    }
  }

  // @ts-ignore
  return done(null, user);
};

passport.use(
  "microsoft-saml",
  // @ts-ignore
  new MultiSamlStrategy(
    {
      passReqToCallback: true, // makes req available in callback
      getSamlOptions: async function (request, done) {
        var id: string;

        if (request.query.provider) {
          id = request.query.provider.toString()!;
        } else if (request.body.RelayState) {
          id = request.body.RelayState;
        } else {
          return done(
            new RedirectError(FAILURE_CLIENT_URL) as unknown as Error
          );
        }

        const authProvider = await TenantAuthModel.findById(id);

        if (authProvider?.type !== "microsoft-saml") {
          return done(
            new RedirectError(FAILURE_CLIENT_URL) as unknown as Error
          );
        }

        const options = authProvider?.options as MicrosoftSAMLOptions;
        return done(null, {
          issuer: options.issuer,
          cert: Buffer.from(options.cert, "base64").toString(),
          entryPoint: options.entryPoint,
          callbackUrl:
            options.redirectUrl ||
            `${process.env.AUTH_CALLBACK_URL}/microsoft-saml/callback`,
          additionalParams: {
            RelayState: request.query.provider?.toString()!,
            login_hint: request.query.email?.toString() || "",
          },
          disableRequestedAuthnContext: true,
        });
      },
    },
    handleSamlStrategy
  )
);
