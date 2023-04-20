import React, { ButtonHTMLAttributes, HTMLProps } from "react";
import { IconType } from "react-icons";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconType;
}

const FloatingActionButton: React.FC<Props> = ({ icon, ...props }) => {
  const Icon = icon;
  return (
    <button
      {...props}
      className="cursor-pointer w-14 h-14 rounded-full shadow-md fixed bottom-4 right-4 bg-primary-600 hover:bg-primary-700 transition-colors flex items-center justify-center"
    >
      <Icon size={36} className="text-white" />
    </button>
  );
};

export default FloatingActionButton;
