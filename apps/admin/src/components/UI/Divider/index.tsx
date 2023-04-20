import React from "react";
import { motion } from "framer-motion";

interface Props {}

const Divider: React.FC<Props> = () => {
  return (
    <motion.div
      layout="position"
      className="border-b border-b-gray-500 border-opacity-40 w-full my-3"
    ></motion.div>
  );
};

export default Divider;
