import { Router } from "express";
import multer from "multer";
import ImageStorage from "../../lib/util/storage/ImageStorage";
import VideoStorage from "../../lib/util/storage/VideoStorage";
import { IMAGES_FOLDER, VIDEOS_FOLDER } from "../../lib/constants";
import { uploadFile } from "../../controllers/admin/upload";
import { defaultNameFn } from "../../lib/util/storage/fs-utils";

const router = Router();

const videoStorage = new VideoStorage({
  destination: VIDEOS_FOLDER,
  nameFn: defaultNameFn,
});

const imageStorage = new ImageStorage({
  destination: IMAGES_FOLDER,
  nameFn: defaultNameFn,
});

const video = multer({ storage: videoStorage });
const image = multer({ storage: imageStorage });

router.post("/video", video.single("video"), uploadFile);
router.post("/image", image.single("image"), uploadFile);

export default router;
