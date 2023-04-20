import { Document, model, Schema } from "mongoose";
import { Image } from "./image";

export interface Video extends Document {
  id: string;
  path: string;
  name: string;
  alt?: string;
  duration?: number;
  size?: number;
  thumbnail: Image;
}

const VideoSchema = new Schema<Video>({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
    unique: true,
  },
  alt: {
    type: String,
  },
  duration: Number,
  size: Number,
  thumbnail: {
    type: Schema.Types.ObjectId,
    ref: "Image",
  },
});

VideoSchema.index({ name: "text" });

const VideoModel = model<Video>("Video", VideoSchema);

export default VideoModel;
