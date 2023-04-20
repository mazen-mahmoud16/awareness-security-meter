import mongoose from "mongoose";
import { MONGOURL } from "../lib/constants";
import "../models/plugins/id";
import "../models";

export async function dbConnect() {
  mongoose.set("strictQuery", false);
  mongoose.set("strictPopulate", false);
  await mongoose.connect(MONGOURL);
}

export async function dbDisconnect() {
  await mongoose.disconnect();
}
