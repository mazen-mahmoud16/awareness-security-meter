export const BASE_API_URL = `/api/`;

import { HiPresentationChartBar } from "react-icons/hi";
import { IconType } from "react-icons/lib";
import { MdAssignment, MdSlowMotionVideo } from "react-icons/md";
import { ModuleType } from "../api/module";

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

export const moduleTypesRoutes: Record<ModuleType, string> = {
  1: "assessment",
  2: "video",
  3: "presentation",
};

export const TYPES = [
  {
    value: ModuleType.Assessment,
    label: moduleTypesNames[ModuleType.Assessment],
  },
  {
    value: ModuleType.Video,
    label: moduleTypesNames[ModuleType.Video],
  },
  {
    value: ModuleType.Presentation,
    label: moduleTypesNames[ModuleType.Presentation],
  },
];

import Assessment from "../pages/modules/module/session/assessment";
import Video from "../pages/modules/module/session/video";

export const moduleTypesComponents: Record<ModuleType, React.ReactElement> = {
  1: <Assessment />,
  2: <Video />,
  3: <></>,
};

export const restartableModules: ModuleType[] = [ModuleType.Video];
