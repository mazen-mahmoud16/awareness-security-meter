import React, { ButtonHTMLAttributes, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { twMerge } from "tailwind-merge";
import Modal from "../../UI/Modal";
import ImageExplorer from "../ImageViewer";
import VideoExplorer from "../VideoViewer";

interface Props
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  onChange(id?: string): void;
  id?: string;
  content?: "image" | "video";
}

const NameToComponent = {
  image: ImageExplorer,
  video: VideoExplorer,
};

const FileUploadButton: React.FC<Props> = ({
  onChange,
  children,
  id,
  content = "image",
  className,
  ...props
}) => {
  const [modal, setModal] = useState(false);

  const Explorer = NameToComponent[content];

  return (
    <>
      <button
        {...props}
        type="button"
        className={twMerge(
          `px-4 py-2 bg-gray-700 hover:bg-gray-600 transition-colors rounded-md text-sm flex items-center ${
            className ?? ""
          }`
        )}
        onClick={() => {
          setModal(true);
        }}
      >
        <AiOutlineCloudUpload size={18} className="mr-1" /> {children}
      </button>
      <Modal
        className="fixed top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-9/12 h-4/5 bg-gray-800 rounded-md text-white px-6 py-8 shadow-md"
        isOpen={modal}
        onRequestClose={() => {
          setModal(false);
        }}
      >
        <Explorer
          initialSelection={id!}
          onClose={(id) => {
            onChange(id!);
            setModal(false);
          }}
        />
      </Modal>
    </>
  );
};

export default FileUploadButton;
