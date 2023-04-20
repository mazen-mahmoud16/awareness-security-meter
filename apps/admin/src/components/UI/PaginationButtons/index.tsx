import React from "react";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";

interface Props {
  page: number;
  setPage(n: number): void;
  isPreviousData?: boolean;
  hasMore?: boolean;
}

const PaginationButtons: React.FC<Props> = ({
  page,
  setPage,
  isPreviousData,
  hasMore,
}) => {
  return (
    <div className="my-5 w-full flex items-center justify-center">
      <button
        className="bg-gray-700 px-2 py-2 rounded-md hover:bg-gray-600 cursor-pointer disabled:cursor-auto disabled:opacity-50"
        onClick={() => {
          setPage(Math.max(page - 1, 0));
        }}
        disabled={page === 0}
      >
        <IoMdArrowBack />
      </button>
      <div className="w-2"></div>
      <span className="select-none">{page + 1}</span>
      <div className="w-2"></div>
      <button
        className="bg-gray-700 px-2 py-2 rounded-md hover:bg-gray-600 cursor-pointer disabled:cursor-auto disabled:opacity-50"
        onClick={() => {
          if (!isPreviousData && hasMore) {
            setPage(page + 1);
          }
        }}
        disabled={isPreviousData || !hasMore}
      >
        <IoMdArrowForward />
      </button>
    </div>
  );
};

export default PaginationButtons;
