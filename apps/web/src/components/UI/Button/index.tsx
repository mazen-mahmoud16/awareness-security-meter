import { HTMLMotionProps, motion } from "framer-motion";
import React from "react";
import { ClipLoader } from "react-spinners";
import { twMerge } from "tailwind-merge";
import { useThemeStore } from "../../../stores/theme";

interface Props extends HTMLMotionProps<"button"> {
  isLoading?: boolean;
}

const Button: React.FC<Props> = ({
  className,
  type,
  isLoading = false,
  children,
  ...props
}) => {
  const theme = useThemeStore((t) => t.theme);
  return (
    <motion.button
      className={twMerge(
        `px-3 py-2 rounded-md focus:ring dark:bg-gray-600 dark:hover:bg-gray-700 border dark:border-gray-500 bg-gray-100 hover:bg-gray-200 border-gray-300 transition-colors flex items-center justify-center ${
          className ?? ""
        }`
      )}
      {...props}
    >
      {isLoading ? (
        <ClipLoader size={24} color={theme === "dark" ? "white" : "black"} />
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
