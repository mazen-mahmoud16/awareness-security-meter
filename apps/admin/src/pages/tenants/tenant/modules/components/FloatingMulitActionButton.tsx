import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../../../../../components/UI/Button";
import { MdAdd } from "react-icons/md";

const FloatingMultiActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.25 } }}
            exit={{ opacity: 0, y: 200, transition: { duration: 0.25 } }}
            className="fixed right-4 bottom-24 flex flex-col"
          >
            <Button onClick={() => navigate("create")}>
              Create New Module
            </Button>
            <div className="h-4"></div>
            <Button onClick={() => navigate("expose")}>Expose a Module</Button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        animate={{
          rotate: isOpen ? 45 : 0,
        }}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="cursor-pointer w-14 h-14 rounded-full shadow-md fixed bottom-4 right-4 bg-primary-600 hover:bg-primary-700 transition-colors flex items-center justify-center"
      >
        <MdAdd size={36} className="text-white" />
      </motion.button>
    </>
  );
};

export default FloatingMultiActionButton;
