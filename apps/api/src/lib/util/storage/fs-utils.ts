import fs from "fs";
import { join, parse } from "path";
import { nameFnType } from ".";

export const deleteAllFilesInFolder = async (path: string) => {
  const files = await fs.promises.readdir(path);
  files.forEach(async (file) => {
    await fs.promises.unlink(join(path, file));
  });
};

export const defaultNameFn: nameFnType = (_req, file) => {
  const { ext, name } = parse(file.originalname);
  return `${name}-${Date.now()}${ext}`;
};
