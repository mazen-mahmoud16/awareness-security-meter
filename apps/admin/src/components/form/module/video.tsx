import React from "react";
import { useFormContext } from "react-hook-form";
import FileUploadButton from "../../file/FileUploadButton";

interface Props {}

const VideoEditor: React.FC<Props> = () => {
  const { watch, setValue } = useFormContext();
  const video = watch("content.video");

  return (
    <div>
      <h1 className="text-2xl font-bold">Video</h1>
      <div className="h-4"></div>
      <FileUploadButton
        content="video"
        id={video}
        onChange={(id) => {
          setValue("content.video", id);
        }}
      >
        Upload
      </FileUploadButton>
    </div>
  );
};

export default VideoEditor;
