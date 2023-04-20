import React, { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { HTMLMotionProps, motion, MotionProps } from "framer-motion";

interface Props extends HTMLMotionProps<"button"> {}

const Button: React.FC<Props> = ({ className, ...props }) => {
  return (
    <motion.button
      className={twMerge(
        `px-3 py-2 rounded-md bg-gray-600 hover:bg-gray-700 transition-colors ${
          className ?? ""
        }`
      )}
      {...props}
    ></motion.button>
  );
};

export default Button;
