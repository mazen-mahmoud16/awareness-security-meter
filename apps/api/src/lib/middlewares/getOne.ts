import mongoose, { Model, ObjectId } from "mongoose";
import asyncHandler from "./asyncHandler";
import { Request } from "express";
import { HttpError } from "../error/HttpError";

interface PaginationOptions {
  paramName?: string;
  fieldName?: string;
  model: Model<any, {}, {}, any>;
  select?: string;
  filterFn?(req: Request): Object;
  transformParam?(id: string): any;
  transformResult?(res: any): any;
}

const getOne = ({
  model,
  select,
  filterFn,
  paramName = "id",
  fieldName = "_id",
  transformParam = (id) => {
    return new Object(id);
  },
  transformResult,
}: PaginationOptions) =>
  asyncHandler(async (req, res) => {
    const id = req.params[paramName];

    var filter: Object = {
      [fieldName]: transformParam ? transformParam(id) : id,
    };

    if (filterFn) filter = { ...filter, ...filterFn(req) };

    var result = await model.findOne(filter).select(select ? select : "");

    result = transformResult ? transformResult(result) : result;

    if (!result) throw new HttpError(404);

    return res.json({
      code: 200,
      result,
    });
  });

export default getOne;
