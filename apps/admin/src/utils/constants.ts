import { MdAssignment, MdSlowMotionVideo } from "react-icons/md";
import { HiPresentationChartBar } from "react-icons/hi";
import { ModuleType } from "../api/module";
import { IconType } from "react-icons";

export const BASE_API_URL = `/api/`;

export const moduleTypesIcons: Record<ModuleType, IconType> = {
  1: MdAssignment,
  2: MdSlowMotionVideo,
  3: HiPresentationChartBar,
};

export const moduleTypesNames: Record<ModuleType, string> = {
  1: "Assessment",
  2: "Video",
  3: "Presentation",
};
