import React from "react";
import { twMerge } from "tailwind-merge";

// eslint-disable-next-line react/display-name
const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, children, id, ...props }, ref) => {
  return (
    <div className={twMerge(`flex items-center ${className ?? ""}`)}>
      <input
        id={id}
        type="checkbox"
        className={`w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600`}
        {...props}
      />
      <label
        htmlFor={id}
        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        {children}
      </label>
    </div>
  );
});

export default Checkbox;
