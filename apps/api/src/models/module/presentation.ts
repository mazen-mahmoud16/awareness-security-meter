import { Document, model, Schema } from "mongoose";
import { Module } from ".";

export enum SlideType {
  Basic = 1,
  Video = 2,
  Question = 3,
}

export type ColorName =
  | "blue"
  | "green"
  | "primary"
  | "red"
  | "orange"
  | "teal"
  | "gray"
  | "black"
  | "white";
export type Accent =
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";
export type Color = `${ColorName}-${Accent}`;

export interface Text {
  content: string;
  fontSize: "sm" | "md" | "xl" | "2xl" | "3xl";
  fontWeight: "thin" | "light" | "bold" | "semibold" | "black";
  color: Color;
  type: "text";
  translations: {
    [locale: string]: {
      content: string;
    };
  };
}

interface Image {
  image: string;
  maxWidth?: number;
  type: "image";
}

export interface BulletPoints {
  points: Text[];
  type: "bullets";
}

export type SlideBody =
  | (Text | Image | BulletPoints)[]
  | {
      video: string;
      translations: {
        [locale: string]: {
          videoUrl: string;
        };
      };
    }
  | {
      prompt: string;
      options: string[];
      answer: number;
      translations: {
        [locale: string]: {
          prompt: string;
          options: string[];
        };
      };
    }[];

export interface SlideInput {
  title: string;
  backgroundColor?: Color;
  type: SlideType;
  body: SlideBody;

  translations: {
    [locale: string]: {
      title: string;
    };
  };
}

export interface Slide extends Document, SlideInput {
  id: string;
}

export interface PresentationModuleInput {
  content: {
    slides: Slide[];
  };
}

export interface PresentationModule
  extends Omit<Module, "content">,
    PresentationModuleInput {}

export const PresentationModuleSchema = new Schema<PresentationModule>({
  content: {
    slides: [
      new Schema<Slide>({
        title: String,
        backgroundColor: String,
        type: { enum: SlideType, type: Number },
        body: Schema.Types.Mixed,
      }),
    ],
  },
});
