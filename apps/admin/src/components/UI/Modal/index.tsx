import React from "react";
import ReactModal, { Props as ReactModalProps } from "react-modal";
import { twMerge } from "tailwind-merge";

interface Props extends ReactModalProps {}

ReactModal.setAppElement("#root");

const Modal: React.FC<Props> = ({ className, ...props }) => {
  const { isOpen } = props;

  return isOpen ? (
    <ReactModal
      className={twMerge(
        `fixed top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-128 h-auto max-h-screen overflow-auto bg-gray-800 rounded-md text-white px-6 py-8 shadow-md outline-none ${
          className ?? ""
        }`
      )}
      overlayClassName="backdrop-blur-sm fixed inset-0 transition-all"
      {...props}
    />
  ) : (
    <></>
  );
};

export default Modal;
