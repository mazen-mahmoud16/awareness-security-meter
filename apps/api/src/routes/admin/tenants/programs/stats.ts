import { Router } from "express";
import {
  deleteProgramSession,
  usersInProgram,
} from "../../../../controllers/admin/tenants/programs";

const router = Router({ mergeParams: true });

router.get("/users", usersInProgram);
router.delete("/deleteUser/:uid", deleteProgramSession);

export default router;
