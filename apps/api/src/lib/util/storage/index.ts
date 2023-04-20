import { Request } from "express";

export type nameFnType = (req: Request, file: Express.Multer.File) => string;

export type Options = {
  nameFn?: nameFnType;
  destination: string;
};
