import { join } from "path";
import fs from "fs";
import { PUBLIC_FOLDER } from "../constants";
import asyncHandler from "./asyncHandler";
import { HttpError } from "../error/HttpError";

const streamImage = asyncHandler(async (req, res) => {
  const imageUrl = req.imageUrl;
  if (!imageUrl) throw new HttpError(404, "Image not found");

  // TODO: Secure this thing
  if (imageUrl.startsWith("http")) {
    return res.redirect(imageUrl);
  }

  const exists = fs.existsSync(imageUrl);

  if (!exists) throw new HttpError(404, "Image not found");

  return res.sendFile(imageUrl);
});

export default streamImage;
