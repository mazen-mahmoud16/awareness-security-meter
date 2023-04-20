import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import path from "path";
import { StorageEngine } from "multer";
import { ParsedQs } from "qs";
import fs from "fs";
import sharp from "sharp";
import { createImage } from "../../../services/image";
import { nameFnType, Options } from ".";
import { HttpError } from "../../error/HttpError";
import logger from "../../logger";

class ImageStorage implements StorageEngine {
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

    const image = sharp(Buffer.concat(chunks));

    const { width, size } = await image.metadata();

    if (!width || !size) {
      return callback(new HttpError(400, "Invalid image"));
    }

    if (size! > 4e7) {
      callback(new HttpError(400, "File is too large"));
      return;
    }

    if (size! > 2e6) {
      image.resize(width! * 0.5);
    }

    const writableStream = fs.createWriteStream(filePath);

    image.pipe(writableStream).on("finish", async () => {
      try {
        const metadata = await image.metadata();
        const { name } = path.parse(file.originalname);
        const id = await createImage({
          name,
          path: filePath,
          height: metadata.height,
          width: metadata.width,
          size: metadata.size,
        });
        logger.info({
          message: `Image Uploaded`,
          code: 24,
          admin: req.admin.id,
          image: id,
        });
        callback(null, {
          filename: id,
        });
      } catch (e) {
        callback(e);
      }
    });
  }

  _removeFile(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    file: Express.Multer.File,
    callback: (error: Error | null) => void
  ): void {}
}
export default ImageStorage;
