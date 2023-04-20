import { Document, model, Schema } from "mongoose";

export interface Image extends Document {
  id: string;
  path: string;
  name: string;
  alt?: string;
  height?: number;
  width?: number;
  size?: number;
  thumbnail?: boolean;
}

const ImageSchema = new Schema<Image>({
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
  height: Number,
  width: Number,
  size: Number,
  thumbnail: {
    type: Boolean,
    default: false,
  },
});

ImageSchema.index({ name: "text", alt: "text" });

const ImageModel = model<Image>("Image", ImageSchema);

export default ImageModel;
