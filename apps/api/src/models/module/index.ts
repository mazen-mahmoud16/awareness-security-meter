import { Document, model, Schema } from "mongoose";
import slugify from "slugify";
import { Image } from "../content/image";
import { Tenant } from "../tenant";
import { AssessmentModuleSchema } from "./assessment";
import { PresentationModuleSchema } from "./presentation";
import { VideoModuleSchema } from "./video";

export enum ModuleType {
  Assessment = 1,
  Video = 2,
  Presentation = 3,
}

export interface ModuleInput {
  name: string;
  type: ModuleType;
  slug: string;
  description: string;
  duration: number;
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
  content: any;
}

export interface Module extends Document, ModuleInput {
  id: string;
}
const ModuleSchema = new Schema<Module>(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      enum: ModuleType,
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
    duration: Number,
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
  },
  { discriminatorKey: "type" }
);

ModuleSchema.index({ name: "text", slug: "text", description: "text" });

ModuleSchema.pre("save", async function (this, next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name.toLowerCase());
    return next();
  }
});

ModuleSchema.pre("findOneAndUpdate", async function (this: any, next) {
  const update = this.getUpdate();
  if (update?.name) {
    this.set({ slug: slugify(update.name.toLowerCase()) });
  }
  next();
});

const ModuleModel = model<Module>("Module", ModuleSchema);
export const AssessmentModuleModel = ModuleModel.discriminator(
  ModuleType.Assessment,
  AssessmentModuleSchema
);
export const PresentationModuleModel = ModuleModel.discriminator(
  ModuleType.Presentation,
  PresentationModuleSchema
);
export const VideoModuleModel = ModuleModel.discriminator(
  ModuleType.Video,
  VideoModuleSchema
);

export default ModuleModel;
