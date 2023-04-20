import zod from "zod";

export const CreateProgramSchema = zod.object({
  name: zod.string().max(64),
  description: zod.string().max(512),
  coverImage: zod.string().optional().nullable(),
  thumbnailImage: zod.string().optional().nullable(),
  tenant: zod.string().optional(),
  modules: zod.array(zod.string()),
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

export const EditProgramSchema = zod.object({
  name: zod.string().max(64).optional(),
  description: zod.string().max(512).optional(),
  coverImage: zod.string().optional().nullable(),
  thumbnailImage: zod.string().optional().nullable(),
  tenant: zod.string().optional(),
  modules: zod.array(zod.string()).optional(),
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
