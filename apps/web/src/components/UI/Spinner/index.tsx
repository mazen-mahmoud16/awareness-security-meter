import { useAtom } from "jotai";
import React, { HTMLAttributes } from "react";
import { ClipLoader } from "react-spinners";
import { twMerge } from "tailwind-merge";
import { useThemeStore } from "../../../stores/theme";

interface Props {
  size?: number;
  className?: string;
}

const Spinner: React.FC<Props> = ({ className, size = 24 }) => {
  const theme = useThemeStore((t) => t.theme);
  return (
    <ClipLoader
      className={twMerge(
        `inline mr-3 w-4 h-4 dark:text-white text-black animate-spin ${
          className ?? ""
        }`
      )}
      size={size}
      color={theme === "dark" ? "white" : "black"}
    ></ClipLoader>
  );
};

export default Spinner;
