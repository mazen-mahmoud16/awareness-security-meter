import React from "react";
import styles from "./spinner.module.css";

interface Props {}

const Spinner: React.FC<Props> = () => {
  return (
    <svg className={styles["spinner"]} viewBox="0 0 50 50">
      <circle
        className={styles["path"] + " stroke-gray-300"}
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="5"
      ></circle>
    </svg>
  );
};

export default Spinner;
