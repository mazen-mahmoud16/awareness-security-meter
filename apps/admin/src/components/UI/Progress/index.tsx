import React, { useEffect, useState } from "react";

interface Props {
  value: number;
  min: number;
  max: number;
  width?: string;
  height?: string;
}

const Progress: React.FC<Props> = ({
  width = "full",
  height = "4",
  value,
  min,
  max,
}) => {
  const [localWidth, setWidth] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setWidth(Math.round((value / (max - min)) * 100));
    }, 10);
  });
  return (
    <div
      className={`bg-gray-500 overflow-hidden relative rounded-lg w-${width} h-${height}`}
    >
      <div
        className="bg-blue-500 absolute top-0 left-0 h-full transition-all"
        style={{ width: `${localWidth}%`, transitionDuration: "600ms" }}
      ></div>
    </div>
  );
};

export default Progress;
