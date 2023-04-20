import React from "react";
import ReactModal, { Props as ReactModalProps } from "react-modal";
import { twMerge } from "tailwind-merge";
import { useThemeStore } from "../../../stores/theme";

interface Props extends ReactModalProps {}

ReactModal.setAppElement("#root");

const Modal: React.FC<Props> = ({ className, children, ...props }) => {
  const theme = useThemeStore((t) => t.theme);
  const { isOpen } = props;

  return isOpen ? (
    <ReactModal
      className={twMerge(`${theme} `)}
      overlayClassName="backdrop-blur-sm fixed inset-0 transition-all"
      {...props}
    >
      <div
        className={`fixed top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-128 h-auto dark:bg-gray-800 bg-white dark:text-white border border-gray-400 border-opacity-60 rounded-md  px-6 py-8 shadow-md outline-none ${
          className ?? ""
        }`}
      >
        {children}
      </div>
    </ReactModal>
  ) : (
    <></>
  );
};

export default Modal;
