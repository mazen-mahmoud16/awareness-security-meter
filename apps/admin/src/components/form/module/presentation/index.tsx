import { motion } from "framer-motion";
import { atom } from "jotai";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";

interface Props {}

const PresentationEditor: React.FC<Props> = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      Work in Progress
      {/* <Button onClick={() => setIsOpen(!isOpen)}>
        Open Presentation Editor
      </Button>
      <AnimatePresence>
        {isOpen && <Editor close={() => setIsOpen(false)} />}
      </AnimatePresence> */}
    </div>
  );
};

const selectedItemAtom = atom<{ id: string; type: "object" } | undefined>(
  undefined
);

const Editor: React.FC<{ close(): void }> = ({ close }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="top-0 left-0 fixed h-full w-full bg-gray-800 p-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Presentation Editor</h1>
        <div
          className="p-2 rounded-md hover:bg-white hover:bg-opacity-20 transition-colors cursor-pointer"
          onClick={close}
        >
          <MdClose />
        </div>
      </div>
      <div className="h-3"></div>
      <ToolBar />
    </motion.div>
  );
};

const ToolBar: React.FC<{}> = () => {
  return (
    <div className="w-full rounded-md border border-gray-400 border-opacity-30 h-10 flex">
      <div className="h-full flex items-center px-2">
        <p>Colour</p>
      </div>
      <div className="w-0.5 h-full bg-gray-400 opacity-30"></div>
    </div>
  );
};

export default PresentationEditor;
