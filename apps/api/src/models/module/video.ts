import { Schema } from "mongoose";
import { Module } from ".";

export interface VideoModuleInput {
  content: {
    video: string;
    provider?: string;
  };
}

export interface VideoModule
  extends Omit<Module, "content">,
    VideoModuleInput {}

export const VideoModuleSchema = new Schema<VideoModule>({
  content: {
    video: { type: Schema.Types.ObjectId, ref: "Video", required: true },
    provider: String,
  },
});
