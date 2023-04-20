import express from "express";
import { getVideo } from "../../../controllers/modules/session/video";
import streamVideo from "../../../lib/middlewares/streamVideo";

const router = express.Router();

router.get("/stream", getVideo, streamVideo);

export default router;
