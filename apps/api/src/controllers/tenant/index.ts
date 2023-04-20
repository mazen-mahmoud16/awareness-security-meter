import { HttpError } from "../../lib/error/HttpError";
import asyncHandler from "../../lib/middlewares/asyncHandler";
import ImageModel from "../../models/content/image";
import TenantModel from "../../models/tenant";

export const logo = (theme: "light" | "dark") =>
  asyncHandler(async (req, _res, next) => {
    const tenant = await TenantModel.findById(req.user?.tenant);
    const image = await ImageModel.findById(
      theme == "dark"
        ? tenant?.darkLogo || tenant?.logo
        : tenant?.logo || tenant?.darkLogo
    );
    if (!image) throw new HttpError(500, "Couldn't Find Logo For Tenant");
    req.imageUrl = image.path;
    next();
  });
