import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { MdDelete } from "react-icons/md";
import { deleteVideo, videoQuery } from "../../../../api/content";
import { formatBytes, seconds2time } from "../../../../utils/parse";
import Button from "../../../UI/Button";
import AuthenticatedImage from "../../AuthenticatedImage";

interface Props {
  selected?: string;
  deselect(): void;
}

const ImagePreview: React.FC<Props> = ({ selected, deselect }) => {
  const { data } = useQuery(videoQuery(selected!, !!selected));
  const queryClient = useQueryClient();

  return (
    <div className="flex justify-center w-1/2 ">
      {selected && data?.result ? (
        <div className="flex flex-col items-center">
          <h2 className="font-semibold text-xl pb-1">{data?.result.name}</h2>
          <p className="opacity-60">
            {seconds2time(Math.round(data?.result.duration || 0))}
          </p>
          <p className="pb-3 opacity-60">
            {data?.result.size && formatBytes(data?.result.size)}
          </p>
          <AuthenticatedImage
            className="max-h-48 max-w-48"
            src={`/admin/content/images/${data.result.thumbnail}`}
          />
          <div className="h-6" />
          <Button
            className="bg-red-400 hover:bg-red-500 p-2"
            onClick={async () => {
              await deleteVideo(data?.result.id!);
              await queryClient.invalidateQueries(["videos"]);
              await queryClient.invalidateQueries(["video"]);
              deselect();
            }}
          >
            <MdDelete size={22} />
          </Button>
        </div>
      ) : (
        <p className="opacity-60 italic">No Video Selected</p>
      )}
    </div>
  );
};

export default ImagePreview;
