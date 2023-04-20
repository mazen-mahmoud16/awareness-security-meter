import fs from "fs";
import { HttpError } from "../../../lib/error/HttpError";
import asyncHandler from "../../../lib/middlewares/asyncHandler";
import getOne from "../../../lib/middlewares/getOne";
import paginate from "../../../lib/middlewares/paginate";
import ImageModel from "../../../models/content/image";
import VideoModel from "../../../models/content/video";

export const images = paginate({
  model: ImageModel,
  select: "-path -thumbnail",
});

export const videos = paginate({
  model: VideoModel,
  select: "-path",
});

export const image = getOne({ model: ImageModel, select: "-path -thumbnail" });

export const video = getOne({ model: VideoModel, select: "-path" });

export const getImage = asyncHandler(async (req, res, next) => {
  const image = await ImageModel.findById(req.params.id);
  req.imageUrl = image?.path;
  next();
});

export const getVideo = asyncHandler(async (req, res, next) => {
  const video = await VideoModel.findById(req.params.id);
  req.imageUrl = video?.path;
  next();
});

const _deleteImage = async (id: string) => {
  return new Promise<boolean>(async (res, rej) => {
    const image = await ImageModel.findById(id);
    if (!image) return rej("Invalid Image");
    if (!fs.existsSync(image.path)) {
      await ImageModel.findByIdAndDelete(id);
    }
    fs.unlinkSync(image.path);
    await ImageModel.findByIdAndDelete(id);
    return res(true);
  });
};

const _deleteVideo = async (id: string) => {
  return new Promise<boolean>(async (res, rej) => {
    const video = await VideoModel.findById(id);
    if (!video) return rej("Invalid Video");
    if (!fs.existsSync(video.path)) {
      await VideoModel.findByIdAndDelete(id);
    }
    fs.unlinkSync(video.path);
    await VideoModel.findByIdAndDelete(id);
    await _deleteImage(video.thumbnail as unknown as string);
    return res(true);
  });
};

export const deleteImage = asyncHandler(async (req, res) => {
  await _deleteImage(req.params.id);
  return res.json({ code: 200 });
});

export const deleteVideo = asyncHandler(async (req, res) => {
  await _deleteVideo(req.params.id);
  return res.json({ code: 200 });
});
