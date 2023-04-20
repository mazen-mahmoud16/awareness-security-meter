import { HttpError } from "../../../lib/error/HttpError";
import asyncHandler from "../../../lib/middlewares/asyncHandler";
import { VideoModule } from "../../../models";
import VideoModel from "../../../models/content/video";

export const getVideo = asyncHandler(async (req, res, next) => {
  if (req.moduleSession.end)
    throw new HttpError(400, "Module Already Complete");

  const videoId = (req.module.content as VideoModule["content"]).video;

  const video = await VideoModel.findById(videoId);

  req.videoUrl = video?.path;

  next();
});
