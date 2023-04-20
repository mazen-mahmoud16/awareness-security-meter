import asyncHandler from "../../lib/middlewares/asyncHandler";
import paginateQuery from "../../lib/util/paginateQuery";
import ImageModel from "../../models/content/image";
import { findModulesForUser } from "../../services/module";

export const modules = asyncHandler(async (req, res) => {
  var { take, skip, search, type } = req.query as any;

  const { result, hasMore } = await paginateQuery(
    { take, skip, search },
    findModulesForUser,
    req.user,
    type
  );

  return res.json({ code: 200, result, hasMore });
});

export const module = asyncHandler(async (req, res) => {
  return res.json({ code: 200, result: req.module });
});

export const moduleImage = (image: "coverImage" | "thumbnailImage") =>
  asyncHandler(async (req, res, next) => {
    const img = await ImageModel.findById(req.module[image]);
    req.imageUrl = img?.path;
    next();
  });
