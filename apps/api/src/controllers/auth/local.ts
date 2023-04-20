import argon2 from "argon2";
import { HttpError } from "../../lib/error/HttpError";
import logger from "../../lib/logger";
import asyncHandler from "../../lib/middlewares/asyncHandler";
import generateOTP from "../../lib/util/generateOTP";
import sendEmail from "../../lib/util/sendMail";
import { sleep } from "../../lib/util/time";
import { Tenant } from "../../models";
import OneTimePasswordModel from "../../models/one-time-password";
import { TenantAuth } from "../../models/tenant/tenant-auth";
import UserModel, { User } from "../../models/user";

export const localLogin = asyncHandler(async (req, res) => {
  await sleep(100);
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email })
    .populate<
      User & {
        tenant?: Tenant & { defaultProvider?: TenantAuth };
        authProvider?: TenantAuth;
      }
    >("authProvider")
    .populate({ path: "tenant", populate: { path: "defaultProvider" } });

  if (!user) throw new HttpError(400, { email: "Invalid User" });

  if (user.authProvider) {
    if (user.authProvider?.type !== "local") {
      throw new HttpError(400, { email: "Invalid User" });
    }
  } else {
    // @ts-ignore
    if (user.tenant?.defaultProvider?.type !== "local") {
      throw new HttpError(400, { email: "Invalid User" });
    }
  }

  const correct = await user.comparePassword(password);

  if (!correct) throw new HttpError(401, { password: "Invalid Password" });

  req.session.user = user.id;

  logger.info({
    message: `${user.email} | User Successfully Logged in`,
    user: user.id,
    strategy: "local",
    code: 1,
  });

  await UserModel.findByIdAndUpdate(user.id, {
    $set: { isRegistered: true },
  });

  return res.json({ code: 200 });
});

export const localToken = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email })
    .populate<User & { tenant?: Tenant; authProvider?: TenantAuth }>(
      "authProvider"
    )
    .populate({ path: "tenant", populate: { path: "defaultProvider" } });

  if (!user) throw new HttpError(400, { email: "Invalid User" });

  if (user?.authProvider) {
    if (user?.authProvider?.type !== "local") {
      throw new HttpError(400, { email: "Invalid User" });
    }
  } else {
    // @ts-ignore
    if (user?.tenant?.defaultProvider?.type !== "local") {
      throw new HttpError(400, { email: "Invalid User" });
    }
  }

  if (user.password) {
    throw new HttpError(400, { email: "User Already Registered" });
  }

  const otpCount = await OneTimePasswordModel.count({ user: user._id });

  if (otpCount > 2)
    throw new HttpError(
      400,
      "Reached One Time Password Limit. Please Try Again later"
    );

  const token = generateOTP(8);

  await OneTimePasswordModel.create({ user: user._id, token });

  await sendEmail(email, `Here is the otp: ${token}`);

  return res.json({ code: 200, message: "Email Sent" });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  await sleep(700);

  const { token, email } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) throw new HttpError(400, { email: "Invalid User" });

  const found = await OneTimePasswordModel.findOne({ token, user: user._id });

  if (found) {
    return res.json({ code: 200, result: { valid: !!found } });
  } else {
    throw new HttpError(400, { token: "Invalid Token" });
  }
});

export const localRegister = asyncHandler(async (req, res) => {
  await sleep(700);

  const { token, email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) throw new HttpError(400, { email: "Invalid User" });

  const found = await OneTimePasswordModel.findOne({ token, user: user._id });

  if (found) {
    const hash = await argon2.hash(password);
    await user.updateOne({ password: hash });
    await user.save();
    req.session.user = user.id;
    return res.json({ code: 200 });
  } else {
    throw new HttpError(400, { token: "Invalid Token" });
  }
});
