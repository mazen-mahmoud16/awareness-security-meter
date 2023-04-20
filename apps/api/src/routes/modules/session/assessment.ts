import express from "express";
import {
  answerQuestion,
  goToQuestion,
  questionImage,
} from "../../../controllers/modules/session/assessment";
import streamImage from "../../../lib/middlewares/streamImage";
import validate from "../../../lib/middlewares/validate";
import { AnswerQuestionSchema } from "../../../validation/module";

const router = express.Router();

router.post("/go/:qId", goToQuestion);
router.get("/image/:qId", questionImage, streamImage);
router.post("/answer/:qId", validate(AnswerQuestionSchema), answerQuestion);

export default router;
