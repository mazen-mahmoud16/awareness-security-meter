import { Document, model, Schema } from "mongoose";
import slugify from "slugify";
import { Image } from "../content/image";
import { Module } from "../module";
import { Tenant } from "../tenant";

export interface Program extends Document {
  id: string;
  name: string;
  slug: string;
  description: string;
  modules: Module[];
  coverImage?: Image;
  thumbnailImage?: Image;
  tenant?: Tenant;
  translations: {
    [locale: string]: {
      name: string;
      description: string;
      coverImage?: Image;
      thumbnailImage?: Image;
    };
  };
}

const ProgramSchema = new Schema<Program>({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  modules: [{ type: Schema.Types.ObjectId, ref: "Module" }],
  coverImage: {
    ref: "Image",
    type: Schema.Types.ObjectId,
  },
  thumbnailImage: {
    ref: "Image",
    type: Schema.Types.ObjectId,
  },
  tenant: {
    ref: "Tenant",
    type: Schema.Types.ObjectId,
  },
  translations: Schema.Types.Mixed,
});

ProgramSchema.index({ name: "text", slug: "text", description: "text" });

ProgramSchema.pre("save", async function (this, next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name.toLowerCase());
    return next();
  }
});

ProgramSchema.pre("findOneAndUpdate", async function (this: any, next) {
  const update = this.getUpdate();
  if (update?.name) {
    this.set({ slug: slugify(update.name.toLowerCase()) });
  }
  next();
});

const ProgramModel = model<Program>("Program", ProgramSchema);

export default ProgramModel;
