import { RequestHandler } from "express";
import fs from "fs";
import { join } from "path";
import { PUBLIC_FOLDER } from "../constants";
import { HttpError } from "../error/HttpError";
import asyncHandler from "./asyncHandler";

const streamVideo = asyncHandler(async (req, res) => {
  const videoUrl = req.videoUrl;
  if (!videoUrl) throw new HttpError(400, "Invalid Video");

  const range = req.headers.range;

  if (typeof range === "undefined") {
    throw new HttpError(400, "Range header is required");
  }

  const videoSize = fs.statSync(videoUrl).size;

  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range?.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  const contentLength = end - start + 1;

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };
  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(videoUrl, { start, end });
  return videoStream.pipe(res);
});

export default streamVideo;
