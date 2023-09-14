import { Document, model, Schema } from "mongoose";
import { ModuleType } from "..";

export const restartableModules: ModuleType[] = [ModuleType.Video];

export interface PresentationSessionContent {
  currentSlide: number;
  answers: {
    answer: number;
    slide: string;
    correctAnswer: number;
    justification?: string;
  }[];
}

export interface AssessmentSessionContent {
  questions: string[];
  currentQuestion: number;
  answers: number[][];
}

export interface ModuleSessionResult {
  score: number;
}

export interface ModuleSessionInput<
  T = AssessmentSessionContent | PresentationSessionContent
> {
  module: any;
  type: ModuleType;
  user: any;
  retriesLeft?: number;
  content?: T;
  isCompleted: boolean;
  result?: ModuleSessionResult;
  previousResults?: ModuleSessionResult[];
}

export interface ModuleSession extends Document, ModuleSessionInput {
  id: string;
  start?: Date;
  end?: Date;
  complete(result?: ModuleSessionResult): void;
  submitAssessmentQuestion(question: string, answer: number[]): void;
  changeQuestion(question: string): void;
  submitPresentationQuestion(
    slide: string,
    answer: number,
    correctAnswer: number,
    justification?: string
  ): void;
  changeSlide(slide: number): void;
  restart(): void;
}

const ModuleSessionSchema = new Schema<ModuleSession>({
  module: {
    type: Schema.Types.ObjectId,
    ref: "Module",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  start: {
    type: Schema.Types.Date,
  },
  type: { enum: ModuleType, required: true, type: Number },
  end: Schema.Types.Date,
  result: Schema.Types.Mixed,
  content: Schema.Types.Mixed,
  isCompleted: { type: Boolean, default: false, required: true },
  retriesLeft: {type: Number, required:false}
});

ModuleSessionSchema.methods.complete = function (
  this: ModuleSession,
  result?: ModuleSessionResult
): void {
  this.end = new Date();
  this.result = result;
  this.isCompleted = true;
  this.markModified("end");
  this.markModified("result");
  this.markModified("isCompleted");
};

ModuleSessionSchema.pre("save", async function (this, next) {
  if (this.isNew) {
    this.start = new Date();
    return next();
  }
});

ModuleSessionSchema.methods.restart = function (this: ModuleSession) {
  this.end = undefined;
  if (this.result) {
    if (this.previousResults) this.previousResults.push(this.result);
    else this.previousResults = [this.result];
  }
  this.result = undefined;
  this.content = undefined;
  this.start = new Date();
  this.isCompleted = false;
  this.markModified("end");
  this.markModified("content");
  this.markModified("result");
  this.markModified("start");
  this.markModified("isCompleted");
};

ModuleSessionSchema.methods.submitAssessmentQuestion = function (
  this: ModuleSession,
  question: string,
  answers: number[]
): void {
  const content = this.content as AssessmentSessionContent;

  const index = content.questions.findIndex((q) => q?.toString() === question);

  if (index === -1) throw new Error("Invalid Question ID");

  if (!content.answers) content.answers = [];

  content.answers[index] = answers;

  this.markModified("content.answers");
};

ModuleSessionSchema.methods.changeQuestion = function (
  this: ModuleSession,
  question: string
): void {
  const content = this.content as AssessmentSessionContent;

  const index = content.questions.findIndex((q) => q?.toString() === question);

  if (index === -1) throw new Error("Invalid Question ID");

  content.currentQuestion = index;

  this.markModified("content.currentQuestion");
};

ModuleSessionSchema.methods.submitPresentationQuestion = function (
  this: ModuleSession,
  slide: string,
  answer: number,
  correctAnswer: number,
  justification?: string
): void {
  const content = this.content as PresentationSessionContent;

  if (!content.answers) content.answers = [];

  if (content.answers.find((a) => a.slide?.toString() === slide))
    throw new Error("Already Answered");

  content.answers.push({
    answer,
    correctAnswer,
    justification,
    slide,
  });

  this.markModified("content.answers");
};

ModuleSessionSchema.methods.changeSlide = function (
  this: ModuleSession,
  slide: number
): void {
  const content = this.content as PresentationSessionContent;

  content.currentSlide = slide;

  this.markModified("session.currentSlide");
};

const ModuleSessionModel = model<ModuleSession>(
  "ModuleSession",
  ModuleSessionSchema
);

export default ModuleSessionModel;
