import { Router } from "express";
import { providers } from "../../controllers/admin/meta";

const router = Router();

router.use("/providers", providers);

export default router;
