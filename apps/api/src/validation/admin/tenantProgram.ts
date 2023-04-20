import zod from "zod";

export const CreateTenantProgramSchema = zod.object({
  program: zod.string(),
  departments: zod
    .array(
      zod.object({
        name: zod.string(),
        deadline: zod.string().optional(),
      })
    )
    .optional(),
  showInLibrary: zod.boolean().optional(),
  showModulesInLibrary: zod.boolean().optional(),
  disabled: zod.boolean().optional(),
});
