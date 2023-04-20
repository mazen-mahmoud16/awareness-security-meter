import { z } from "zod";
import { AUTHENTICATION_STRATEGIES } from "../../lib/constants";

export const TenantSchema = z.object({
  name: z.string(),
  provider: z.enum(AUTHENTICATION_STRATEGIES),
  domain: z.string(),
  logo: z.string(),
  darkLogo: z.string().optional(),
  lockToDomain: z.boolean(),
});

export const EditTenantSchema = z.object({
  name: z.string().optional(),
  logo: z.string().optional().nullable(),
  darkLogo: z.string().optional().nullable(),
  departments: z.array(z.string()).optional(),
  lockToDomain: z.boolean().optional(),
});

export const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  department: z.string(),
  authProvider: z.string().optional(),
});

export const EditUserSchema = z.object({
  name: z.string().optional(),
  department: z.string().nullish(),
  authProvider: z.string().nullish(),
});

export const UserImportSchema = z.object({
  fields: z.array(z.string()),
  content: z.string(),
});

export const AuthProviderSchema = z.object({
  name: z.string(),
  type: z.enum(AUTHENTICATION_STRATEGIES),
  options: z
    .object({
      clientSecret: z.string(),
      clientId: z.string(),
      redirectUrl: z.string().optional(),
    })
    .or(
      z
        .object({
          issuer: z.string(),
          cert: z.string(),
          redirectUrl: z.string().optional(),
          entryPoint: z.string(),
        })
        .optional()
    ),
});
