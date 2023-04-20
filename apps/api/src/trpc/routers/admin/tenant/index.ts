import { TRPCError } from "@trpc/server";
import { z, ZodError } from "zod";
import { SafeDoc } from "../../../../models";
import TenantModel from "../../../../models/tenant";
import TenantAuthModel, {
  TenantAuthInput,
} from "../../../../models/tenant/tenant-auth";
import UserModel from "../../../../models/user";
import { AuthProviderSchema } from "../../../../validation/admin/tenant";
import { adminProcedure, publicProcedure, router } from "../../../trpc";
import { userRouter } from "./user";

export const tenantRouter = router({
  departments: adminProcedure.input(z.string()).query(async ({ input }) => {
    const departments = (await TenantModel.findById(input))?.departments;
    return departments;
  }),
  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        domain: z.string(),
        logo: z.string().optional(),
        darkLogo: z.string().optional(),
        lockToDomain: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const exists = await TenantModel.findOne({
        $or: [{ name: input.name }, { domain: input.domain }],
      });

      if (exists) {
        // if (exists.domain == input.domain)
        //   throw new TRPCError({
        //     code: "BAD_REQUEST",
        //     message: "Tenant Domain Already Exists",
        //   });
        if (exists.name === input.name)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Tenant Name Already Exists",
          });
      }

      const result = await TenantModel.create(input);

      ctx.logger.info({
        message: `Tenant Created`,
        code: 15,
        admin: ctx.session.user.id,
        tenant: JSON.parse(JSON.stringify(result)),
      });

      return result.id;
    }),
  addProvider: adminProcedure
    .input(z.object({ tenant: z.string(), provider: AuthProviderSchema }))
    .mutation(async ({ input, ctx }) => {
      const auth = await TenantAuthModel.create({
        tenant: input.tenant,
        name: input.provider.name,
        type: input.provider.type,
        options: input.provider.options,
      });
      const count = await TenantAuthModel.count();
      if (count === 1) {
        await TenantModel.findByIdAndUpdate(input.tenant, {
          defaultProvider: auth.id,
        });
      }
      return auth.id;
    }),
  setDefaultProvider: adminProcedure
    .input(z.object({ tenant: z.string(), provider: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      if (input.provider) {
        const auth = await TenantAuthModel.findById(input.provider);
        if (auth) {
          await TenantModel.findByIdAndUpdate(input.tenant, {
            defaultProvider: input.provider,
          });
        }
      } else {
        await TenantModel.findByIdAndUpdate(input.tenant, {
          defaultProvider: undefined,
        });
      }
    }),
  deleteProvider: adminProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      await TenantAuthModel.findByIdAndDelete(input);
      await TenantModel.findOneAndUpdate(
        { defaultProvider: input },
        { $set: { defaultProvider: undefined } }
      );
      await UserModel.updateMany(
        { authProvider: input },
        { $set: { authProvider: undefined } }
      );
    }),
  editProvider: adminProcedure
    .input(z.object({ id: z.string(), provider: AuthProviderSchema }))
    .mutation(async ({ input }) => {
      await TenantAuthModel.findByIdAndUpdate(input.id, input.provider);
    }),
  providers: adminProcedure.input(z.string()).query(async ({ input }) => {
    const authProviders = await TenantAuthModel.find({ tenant: input }).select(
      "-options"
    );
    return authProviders as SafeDoc<TenantAuthInput>[];
  }),
  defaultProvider: adminProcedure.input(z.string()).query(async ({ input }) => {
    const tenant = await TenantModel.findById(input).select("defaultProvider");
    return (tenant?.defaultProvider as string | undefined) || false;
  }),
  provider: adminProcedure.input(z.string()).query(async ({ input }) => {
    const authProvider = await TenantAuthModel.findById(input);
    return authProvider as SafeDoc<TenantAuthInput>;
  }),
  users: userRouter,
});
