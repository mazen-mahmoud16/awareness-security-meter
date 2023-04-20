import React, { LabelHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {}

const InputLabel: React.FC<Props> = ({ className, ...props }) => {
  return (
    <label
      className={twMerge(
        `block mb-2 text-sm font-medium text-gray-900 dark:text-white ${
          className ? className : ""
        }`
      )}
      {...props}
    />
  );
};

export default InputLabel;
