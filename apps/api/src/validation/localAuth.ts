import zod, { string } from "zod";

export const VerifyTokenSchema = zod.object({
  email: zod.string(),
  token: zod.string(),
});
export const GenerateTokenSchema = zod.object({
  email: zod.string(),
});
export const RegisterSchema = zod.object({
  email: zod.string(),
  token: zod.string(),
  password: zod
    .string()
    .regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$"), {
      message: "Password not Strong Enough",
    }),
});
export const LoginSchema = zod.object({
  email: zod.string(),
  password: zod.string(),
});
