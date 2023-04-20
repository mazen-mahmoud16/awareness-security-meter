import React from "react";
import { twMerge } from "tailwind-merge";
import { IconType } from "react-icons/lib";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  icon: IconType;
  label: string;
  iconSize?: number;
}

const Pair: React.FC<Props> = ({
  icon,
  label,
  className,
  iconSize,
  ...props
}) => {
  const I = icon;
  return (
    <div
      {...props}
      className={twMerge(`flex items-center py-2 ${className ?? ""}`)}
    >
      <I className="text-primary-600" size={iconSize ?? 20} />
      <p className="pl-2">{label}</p>
    </div>
  );
};

export default Pair;
