import React from "react";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import Button from "../Button";

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
    <div className="my-6 w-full flex items-center justify-center">
      <Button
        className=" px-2 py-2 rounded-md disabled:cursor-auto disabled:opacity-50"
        onClick={() => {
          setPage(Math.max(page - 1, 0));
        }}
        disabled={page === 0}
      >
        <IoMdArrowBack />
      </Button>
      <div className="w-2"></div>
      <span className="select-none">{page + 1}</span>
      <div className="w-2"></div>
      <Button
        className="px-2 py-2 rounded-md disabled:cursor-auto disabled:opacity-50"
        onClick={() => {
          if (!isPreviousData && hasMore) {
            setPage(page + 1);
          }
        }}
        disabled={isPreviousData || !hasMore}
      >
        <IoMdArrowForward />
      </Button>
    </div>
  );
};

export default PaginationButtons;
