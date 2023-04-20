import { Router } from "express";
import {
  deleteImage,
  deleteVideo,
  getImage,
  getVideo,
  image,
  images,
  video,
  videos,
} from "../../controllers/admin/content";
import streamImage from "../../lib/middlewares/streamImage";
import streamVideo from "../../lib/middlewares/streamVideo";

const router = Router();

router.get("/images", images);
router.get("/videos", videos);

router.get("/images/:id", getImage, streamImage);
router.get("/videos/:id", getVideo, streamVideo);

router.get("/images/:id/details", image);
router.get("/videos/:id/details", video);

router.delete("/images/:id", deleteImage);
router.delete("/videos/:id", deleteVideo);

export default router;
