import { Router } from "express";
import multer from "multer";
import path from "path";
import { deleteUsers } from "../../../../controllers/admin/tenants";
import {
  addUser,
  deleteUser,
  editUser,
  getUser,
  getUsers,
  importUsers,
} from "../../../../controllers/admin/tenants/users";
import { TEMP_FOLDER } from "../../../../lib/constants";
import validate from "../../../../lib/middlewares/validate";
import TemporaryStorage from "../../../../lib/util/storage/TemporaryStorage";
import {
  EditUserSchema,
  UserSchema,
} from "../../../../validation/admin/tenant";
import stats from "./stats";

const router = Router({ mergeParams: true });

router.get("/", getUsers);
router.get("/:uid", getUser);
router.post("/", validate(UserSchema), addUser);
router.put("/:uid", validate(EditUserSchema), editUser);
router.delete("/:uid", deleteUser);
router.delete("/", deleteUsers);

const temporaryStorage = new TemporaryStorage({
  destination: TEMP_FOLDER,
  nameFn: (_, file) => {
    const uniqueSuffix = Date.now();
    const extension = path.extname(file.originalname);

    return `${uniqueSuffix}${extension}`;
  },
});

const temporary = multer({ storage: temporaryStorage });

router.post("/import", temporary.single("csv"), importUsers);

router.use("/:uid/stats", stats);

export default router;
