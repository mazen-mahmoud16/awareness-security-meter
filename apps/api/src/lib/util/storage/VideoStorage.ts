import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import path from "path";
import { StorageEngine } from "multer";
import { ParsedQs } from "qs";
import fs from "fs";
import { createImage } from "../../../services/image";
// @ts-ignore
import { path as ffprobePath } from "@ffprobe-installer/ffprobe";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import { VIDEO_THUMBNAILS_FOLDER } from "../../constants";
import { createVideo } from "../../../services/video";
import { nameFnType, Options } from ".";
import logger from "../../logger";

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const createThumnail = (
  videoPath: string,
  filename: string,
  cb: (
    err: Error | null,
    path?: string,
    duration?: number,
    size?: number
  ) => void
) => {
  ffmpeg.ffprobe(videoPath, (err, metadata) => {
    if (err || !metadata) {
      cb(err);
    }
    const { width, height } = metadata.streams[0];
    const { duration, size } = metadata.format;

    ffmpeg(videoPath)
      .on("end", function () {
        cb(null, filename, duration, size);
      })
      .on("error", function (err) {
        cb(err);
      })
      .takeScreenshots(
        {
          count: 1,
          timemarks: [(duration || 0) / 2],
          size: `${width}x${height}`,
          filename: filename,
        },
        VIDEO_THUMBNAILS_FOLDER
      );
  });
};

class VideoStorage implements StorageEngine {
  private nameFunction: nameFnType;
  private destination: string;

  constructor(options: Options) {
    this.nameFunction = options.nameFn!;
    this.destination = options.destination;
  }

  async _handleFile(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    file: Express.Multer.File,
    callback: (
      error?: any,
      info?: Partial<Express.Multer.File> | undefined
    ) => void
  ): Promise<void> {
    const fileName = this.nameFunction(req, file);
    const filePath = path.join(this.destination, fileName);

    const chunks = [];
    for await (let chunk of file.stream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        return callback(err);
      }
      createThumnail(
        filePath,
        `${path.basename(fileName)}-${Date.now()}.png`,
        async (err, filename, duration, size) => {
          if (err) {
            return callback(err);
          }
          const { name } = path.parse(file.originalname);
          const thumbnailId = await createImage({
            name: `${name}-thumbnail`,
            path: path.join(VIDEO_THUMBNAILS_FOLDER, filename!),
            thumbnail: true,
          });
          const id = await createVideo({
            name,
            path: filePath,
            thumbnail: thumbnailId as any,
            duration,
            size,
          });

          logger.info({
            message: `Video Uploaded`,
            code: 25,
            admin: req.admin.id,
            video: id,
          });

          callback(null, { filename: id });
        }
      );
    });
  }

  _removeFile(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    file: Express.Multer.File,
    callback: (error: Error | null) => void
  ): void {}
}
export default VideoStorage;
