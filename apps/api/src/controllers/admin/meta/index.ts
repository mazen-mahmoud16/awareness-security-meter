import { AUTHENTICATION_STRATEGIES } from "../../../lib/constants";
import asyncHandler from "../../../lib/middlewares/asyncHandler";

export const providers = asyncHandler((req, res) => {
  return res.json({ code: 200, result: AUTHENTICATION_STRATEGIES });
});
