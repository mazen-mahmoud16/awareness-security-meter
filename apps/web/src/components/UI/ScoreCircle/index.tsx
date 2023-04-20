import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface Props {
  value?: string;
  percentage: number;
  radius?: number;
  fontSize?: string;
}

const ScoreCircle: React.FC<Props> = ({
  value,
  percentage,
  radius = 98,
  fontSize = "2.6rem",
}) => {
  const circumference = useMemo(() => {
    return 2 * Math.PI * radius;
  }, []);

  const color = useMemo(() => {
    if (percentage < 0.5) {
      return "#FF5E0E";
    } else if (percentage < 0.75) {
      return "#FFA836";
    } else {
      return "#4BB543";
    }
  }, [percentage]);

  return (
    <div className="relative w-56 h-56">
      <svg className="w-56 h-56">
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - percentage) }}
          strokeDasharray={`${circumference} ${circumference}`}
          stroke={color}
          strokeWidth="6"
          fill="transparent"
          r={radius}
          cx="110"
          cy="110"
          className="-rotate-90 absolute top-1/2 left-1/2"
          style={{
            transition: "all 400ms ease-out",
            transformOrigin: "50% 50%",
          }}
        />
      </svg>
      <h2
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold text-center"
        style={{ fontSize }}
      >
        {value || `${Math.round(percentage * 100)}%`}
      </h2>
    </div>
  );
};

export default ScoreCircle;
