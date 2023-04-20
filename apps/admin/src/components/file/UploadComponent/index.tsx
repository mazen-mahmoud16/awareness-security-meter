import axios from "axios";
import { motion } from "framer-motion";
import React, { useCallback, useState } from "react";
import { useDropzone, FileRejection, Accept } from "react-dropzone";
import { IoIosClose } from "react-icons/io";
import Progress from "../../UI/Progress";

interface Props {
  onClose(id?: string): void;
  allowedTypes: Accept;
  uploadPath?: string;
  uploadFieldname: string;
  onUpload?: (files: File[]) => void;
}

const UploadComponent: React.FC<Props> = ({
  onClose,
  allowedTypes,
  uploadPath,
  uploadFieldname,
  onUpload,
}) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>();

  const onDrop = useCallback(async (files: File[]) => {
    if (uploadPath) {
      const [file] = files;
      const formData = new FormData();
      formData.append(uploadFieldname, file, file.name);
      try {
        const response = await axios.post(uploadPath, formData, {
          onUploadProgress(progressEvent) {
            if (progressEvent.total)
              setProgress(
                Math.round((progressEvent.loaded / progressEvent.total) * 100)
              );
          },
        });

        onClose(response.data.result);
      } catch (e) {
        setProgress(0);
        // @ts-ignore
        if (e.error) {
          // @ts-ignore
          setError(e.error);
        }
      }
    } else {
      if (onUpload) {
        await onUpload(files);
        onClose();
      }
    }
  }, []);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: allowedTypes,
  });

  function getBorderColor() {
    if (isDragAccept) {
      return "#00e676";
    }
    if (isDragReject) {
      return "#ff1744";
    }
    return "#eeeeee89";
  }

  return (
    <>
      <div
        className="h-full w-full flex flex-col items-center justify-center border-2 border-gray-400 border-opacity-30 border-dashed p-8 rounded-lg "
        {...getRootProps()}
        style={{
          borderColor: getBorderColor(),
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
        <div className="py-8 w-full">
          <p className="pb-2 text-center">{progress}%</p>
          <Progress value={progress} min={0} max={100} height="4" />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default UploadComponent;
