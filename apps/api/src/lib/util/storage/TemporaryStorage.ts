import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import path from "path";
import { StorageEngine } from "multer";
import { ParsedQs } from "qs";
import fs from "fs";
import { nameFnType, Options } from ".";

class TemporaryStorage implements StorageEngine {
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
        callback(err);
      }
      callback(null, { path: filePath });
    });
  }

  _removeFile(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    file: Express.Multer.File,
    callback: (error: Error | null) => void
  ): void {}
}
export default TemporaryStorage;
