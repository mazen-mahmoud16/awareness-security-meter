import { adminProcedure, publicProcedure, router } from "../../trpc";
import { tenantRouter } from "./tenant";

export const adminRouter = router({
  tenant: tenantRouter,
});
