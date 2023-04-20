import zod from "zod";

export const CreateTenantModuleSchema = zod.object({
  module: zod.string(),
  departments: zod
    .array(
      zod.object({
        department: zod.string(),
        deadline: zod.string().optional(),
      })
    )
    .optional(),
  showInLibrary: zod.boolean().optional(),
  disabled: zod.boolean().optional(),
});

export const EditTenantModuleSchema = zod.object({
  departments: zod
    .array(
      zod.object({
        department: zod.string(),
        deadline: zod.string().optional(),
      })
    )
    .optional(),
  showInLibrary: zod.boolean().optional(),
  disabled: zod.boolean().optional(),
});
