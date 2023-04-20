import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../../../trpc";
import { EditUserSchema } from "../../../../validation/admin/tenant";
import UserModel, { UserInput } from "../../../../models/user";
import { SafeDoc } from "../../../../models";
import { TenantAuthInput } from "../../../../models/tenant/tenant-auth";
import { PipelineStage } from "mongoose";
import TenantModel from "../../../../models/tenant";

export const userRouter = router({
  editUser: adminProcedure
    .input(z.object({ id: z.string(), data: EditUserSchema }))
    .mutation(async ({ ctx, input }) => {
      const pipeline: PipelineStage[] = [{ $set: input.data }];
      if (input.data.authProvider === null) {
        pipeline.push({ $unset: "authProvider" });
      }

      await UserModel.findByIdAndUpdate(input.id, pipeline);

      const user = await UserModel.findById(input.id);
      if (input.data.department) {
        const tenant = await TenantModel.findById(user?.tenant);
        if (tenant)
          if (!tenant.departments.includes(input.data.department)) {
            tenant.departments.push(input.data.department);
            tenant.markModified("departments");
            await tenant.save();
          }
      }
    }),
  getUser: adminProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return (await UserModel.findById(input)
      .select("-password")
      .populate("authProvider")) as SafeDoc<
      Omit<UserInput, "authProvider"> & {
        authProvider: SafeDoc<TenantAuthInput>;
      }
    >;
  }),
});
