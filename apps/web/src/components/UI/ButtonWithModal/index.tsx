import { HTMLMotionProps } from "framer-motion";
import React, { ButtonHTMLAttributes, useState } from "react";
import Button from "../Button";
import Modal from "../Modal";

interface Props extends HTMLMotionProps<"button"> {
  message?: string;
  caption?: string;
  onClick(): void;
}

const ButtonWithModal: React.FC<Props> = ({
  message,
  onClick,
  caption,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        {...props}
      ></Button>
      <Modal
        className="w-auto h-auto"
        isOpen={isOpen}
        onRequestClose={() => {
          setIsOpen(false);
        }}
      >
        <div className="flex flex-col justify-between items-end h-full">
          <div className="w-full">
            <h1 className="text-2xl font-bold">
              {message || "Are you sure you want to do this?"}
            </h1>
            <p className="text-sm font-light opacity-70">
              {caption || "You can't go back to old changes."}
            </p>
          </div>
          <div className="h-8"></div>
          <div className="flex">
            <Button
              className="bg-primary-600 hover:bg-primary-700"
              onClick={async () => {
                await onClick();
                setIsOpen(false);
              }}
            >
              Yes
            </Button>
            <div className="w-4"></div>
            <Button
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ButtonWithModal;
