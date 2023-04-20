import React from "react";
import { twMerge } from "tailwind-merge";

// eslint-disable-next-line react/display-name
const TextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      autoComplete="off"
      ref={ref}
      className={twMerge(
        `bg-gray-50 border-2 transition-colors outline-none border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-neutral-100 dark:focus:border-neutral-100 ${
          className ?? ""
        }`
      )}
      {...props}
    />
  );
});

export default TextArea;
