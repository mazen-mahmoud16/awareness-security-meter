import zod, { ZodError } from "zod";
import { HttpError } from "../../lib/error/HttpError";
import { ModuleType } from "../../models/module";
import { SlideType } from "../../models/module/presentation";

export const CreateModuleSchema = zod.object({
  name: zod.string().max(64),
  description: zod.string().max(512),
  type: zod.nativeEnum(ModuleType),
  duration: zod.number().optional(),
  coverImage: zod.string().optional().nullable(),
  thumbnailImage: zod.string().optional().nullable(),
  tenant: zod.string().optional().nullable(),
  content: zod.any(),
  translations: zod
    .object({
      name: zod.string().max(64),
      description: zod.string().max(512),
      coverImage: zod.string().optional().nullable(),
      thumbnailImage: zod.string().optional().nullable(),
    })
    .optional()
    .nullable(),
});

export const AssessmentModuleContentSchema = zod.object({
  questions: zod.array(
    zod.object({
      answers: zod.array(zod.number()),
      options: zod.array(zod.string()),
      prompt: zod.string().max(256),
      image: zod.string().optional().nullable(),
      translations: zod
        .object({
          prompt: zod.string().max(256),
          options: zod.array(zod.string()),
        })
        .optional()
        .nullable(),
    })
  ),
});

const TextSchema = zod.object({
  content: zod.string(),
  fontSize: zod.enum(["sm", "md", "xl", "2xl", "3xl"]),
  fontWeight: zod.enum(["thin", "light", "bold", "semibold", "black"]),
  color: zod.string(),
  type: zod.enum(["text"]),
  translations: zod
    .object({
      content: zod.string(),
    })
    .nullable(),
});

const ImageSchema = zod.object({
  image: zod.string(),
  type: zod.enum(["image"]),
  maxWidth: zod.number().optional(),
  translations: zod
    .object({
      image: zod.string(),
    })
    .optional()
    .nullable(),
});

const BulletSchema = zod.object({
  type: zod.enum(["bullets"]),
  points: zod.array(TextSchema),
});

const BasicBodySchema = zod.array(TextSchema.or(ImageSchema).or(BulletSchema));

const VideoBodySchema = zod.object({
  videoUrl: zod.string(),
  translations: zod
    .object({
      videoUrl: zod.string(),
    })
    .optional(),
});

const QuestionBodySchema = zod.object({
  prompt: zod.string(),
  options: zod.array(zod.string()),
  answer: zod.number(),
  translations: zod
    .object({
      prompt: zod.string(),
      options: zod.array(zod.string()),
    })
    .optional(),
});

export const PresentationModuleContentSchema = zod.object({
  slides: zod.array(
    zod.object({
      backgroundColor: zod.string(),
      type: zod.nativeEnum(SlideType),
      title: zod.string().max(128),
      body: BasicBodySchema.or(VideoBodySchema).or(QuestionBodySchema),
      translations: zod.object({ title: zod.string().max(128) }).optional(),
    })
  ),
});

export const VideoModuleContentSchema = zod.object({
  video: zod.string(),
  provider: zod.string().optional(),
});

const TypeToSchema: Record<ModuleType, zod.ZodObject<any>> = {
  1: AssessmentModuleContentSchema,
  2: VideoModuleContentSchema,
  3: PresentationModuleContentSchema,
};

export const validateContent = (
  type: ModuleType,
  content: any,
  isPartial = false
) => {
  try {
    var schema = TypeToSchema[type];
    if (isPartial) schema = schema.partial();
    schema.parse(content);
  } catch (e) {
    if (e instanceof ZodError) {
      throw new HttpError(400, e.flatten().fieldErrors);
    }
  }
};
