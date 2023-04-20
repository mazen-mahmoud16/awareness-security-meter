import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { imagesQuery } from "../../../api/content";
import Button from "../../UI/Button";
import CenteredSpinner from "../../UI/CenteredSpinner";
import Input from "../../UI/Input";
import Modal from "../../UI/Modal";
import PaginationButtons from "../../UI/PaginationButtons";
import UploadComponent from "../UploadComponent";
import ImageList from "./ImageList";
import ImagePreview from "./ImagePreview";

interface Props {
  onClose(id: string | null): void;
  initialSelection: string | null;
}

const IMAGE_UPLOAD_PATH = "/admin/upload/image";
const ITEMS_PER_PAGE = 5;

const ImageExplorer: React.FC<Props> = ({ onClose, initialSelection }) => {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const { data, isLoading, isPreviousData } = useQuery(
    imagesQuery(page * ITEMS_PER_PAGE, ITEMS_PER_PAGE, search)
  );
  const queryClient = useQueryClient();
  const [uploadModal, setUploadModal] = useState(false);
  const [selected, setSelected] = useState(initialSelection);

  return (
    <div className="flex flex-col h-full w-full justify-start items-start">
      <button
        className="cursor-pointer absolute top-6 right-3"
        onClick={() => onClose(selected)}
      >
        <IoIosClose size={52} color="white" />
      </button>
      <h1 className="text-2xl font-bold pb-6">Images</h1>
      <Input
        className="mt-2 mb-8"
        placeholder="Search by Name"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(0);
        }}
      />
      <div className="flex flex-1 w-full">
        {isLoading && <CenteredSpinner />}
        {data?.result && (
          <ImageList
            images={data.result}
            onSelect={(id) => {
              setSelected(id ?? null);
            }}
            selected={selected}
          />
        )}
        {/* Preview */}
        <ImagePreview deselect={() => setSelected(null)} selected={selected} />
      </div>
      {/* Pagination Buttons */}
      <PaginationButtons
        page={page}
        setPage={setPage}
        hasMore={data?.hasMore}
        isPreviousData={isPreviousData}
      />

      <div className="flex">
        <button
          className="mt-auto bg-primary-600 px-4 py-2 rounded-md hover:bg-primary-700 transition-colors mr-4"
          onClick={() => {
            onClose(selected);
          }}
        >
          Save
        </button>
        <Button
          className="mr-4"
          onClick={() => {
            setSelected(null);
          }}
        >
          Deselect
        </Button>
        <button
          className="mt-auto bg-gray-600 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          onClick={() => {
            setUploadModal(true);
          }}
        >
          Upload
        </button>
      </div>
      <Modal
        isOpen={uploadModal}
        onRequestClose={async () => {
          setUploadModal(false);
          await queryClient.invalidateQueries(["images"]);
        }}
      >
        <UploadComponent
          onClose={async (id) => {
            setUploadModal(false);
            await queryClient.invalidateQueries(["images"]);
          }}
          allowedTypes={{ "image/*": [".png", ".gif", ".jpeg", ".jpg"] }}
          uploadFieldname="image"
          uploadPath={IMAGE_UPLOAD_PATH}
        />
      </Modal>
    </div>
  );
};

export default ImageExplorer;
