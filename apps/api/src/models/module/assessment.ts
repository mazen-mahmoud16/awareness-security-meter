import { Document, Schema } from "mongoose";
import { Module } from ".";
import { Image } from "../content/image";

export interface QuestionInput {
  prompt: string;
  options: string[];
  isMulti?: boolean;
  answers: number[];
  image: Image;
  translations: {
    [locale: string]: {
      prompt: string;
      options: string[];
    };
  };
}

export interface Question extends Document, QuestionInput {
  id: string;
}

export interface AssessmentModuleInput {
  content: {
    questions: Question[];
    isRandom: boolean;
    noOfRetries?: number;
    numberOfQuestions?: number;
    maxTime?: number;
  };
}

export interface AssessmentModule
  extends Omit<Module, "content">,
    AssessmentModuleInput {}

const QuestionSchema = new Schema<Question>({
  prompt: String,
  options: [String],
  isMulti: Boolean,
  answers: [Number],
  image: { ref: "Image", type: Schema.Types.ObjectId },
  translations: Schema.Types.Mixed,
});

QuestionSchema.pre("save", function (this, next) {
  if (this.isModified("answers")) {
    this.isMulti = this.answers.length > 1;
  }
  next();
});

export const AssessmentModuleSchema = new Schema<AssessmentModule>({
  content: {
    questions: [QuestionSchema],
    isRandom: { type: Boolean, default: false },
    noOfRetries: { type: Number, default: 1 },
    numberOfQuestions: Number,
    maxTime: Number,
  },
});
