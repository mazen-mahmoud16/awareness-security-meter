import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { MdDelete } from "react-icons/md";
import { deleteImage, imageQuery } from "../../../../api/content";
import { formatBytes } from "../../../../utils/parse";
import Button from "../../../UI/Button";
import AuthenticatedImage from "../../AuthenticatedImage";

interface Props {
  selected: string | null;
  deselect(): void;
}

const ImagePreview: React.FC<Props> = ({ selected, deselect }) => {
  const { data: imageData } = useQuery(imageQuery(selected!, !!selected));
  const queryClient = useQueryClient();

  return (
    <div className="flex justify-center w-1/2 ">
      {selected && imageData?.result ? (
        <div className="flex flex-col items-center">
          <h2 className="font-semibold text-xl pb-1">
            {imageData?.result.name}
          </h2>
          <p className="opacity-60">
            {imageData?.result.height &&
              imageData.result.width &&
              `${imageData.result.width}x${imageData.result.height}`}
          </p>
          <p className="pb-3 opacity-60">
            {imageData?.result.size && formatBytes(imageData?.result.size)}
          </p>
          <AuthenticatedImage
            className="max-h-48 max-w-48"
            src={`/admin/content/images/${selected}`}
          />
          <div className="h-6" />
          <Button
            className="bg-red-400 hover:bg-red-500 p-2"
            onClick={async () => {
              await deleteImage(imageData?.result.id!);
              await queryClient.invalidateQueries(["images"]);
              await queryClient.invalidateQueries(["image"]);
              deselect();
            }}
          >
            <MdDelete size={22} />
          </Button>
        </div>
      ) : (
        <p className="opacity-60 italic">No Image Selected</p>
      )}
    </div>
  );
};

export default ImagePreview;
