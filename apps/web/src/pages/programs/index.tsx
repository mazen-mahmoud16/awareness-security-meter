import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { FaCheck, FaTimes } from "react-icons/fa";
import { RiNumbersLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Program, programsQuery } from "../../api/program";
import AuthenticatedImage from "../../components/UI/AuthenticatedImage";
import CenteredSpinner from "../../components/UI/CenteredSpinner";
import EmptyListMessage from "../../components/UI/EmptyListMessage";
import PaginationButtons from "../../components/UI/PaginationButtons";
import Pair from "../../components/UI/Pair";

const Programs = () => {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const { data, isLoading, isPreviousData } = useQuery(
    programsQuery({ skip: page * 8, take: 8, search })
  );
  return (
    <div>
      <Helmet>
        <title>Programs</title>
      </Helmet>
      <h1 className="text-4xl font-bold text-center">Programs</h1>
      <div className="h-14"></div>
      {data && data.result.length === 0 && (
        <EmptyListMessage entity="Program" />
      )}
      {isLoading && <CenteredSpinner />}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 place-items-center gap-x-4 gap-y-10 ">
        {data &&
          data.result.map((module) => <Card key={module.id} {...module} />)}
      </div>
      <div className="h-6" />
      {data && data.result.length !== 0 && (
        <PaginationButtons
          page={page}
          setPage={setPage}
          hasMore={data.hasMore}
          isPreviousData={isPreviousData}
        />
      )}
    </div>
  );
};

const Card: React.FC<Program> = ({
  id,
  name,
  isCompleted,
  slug,
  length,
  description,
}) => {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();
  return (
    <motion.div
      onClick={() => navigate(slug)}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      className="h-96 w-72 border rounded-md shadow-md cursor-pointer flex flex-col dark:border-gray-400 dark:border-opacity-40 border-gray-700 border-opacity-30 relative"
      whileHover="hover"
    >
      <div className="h-96 relative flex overflow-hidden rounded-t-md">
        <motion.div
          className="rounded-t-md absolute top-0 left-0 w-full h-full"
          variants={{
            hover: { filter: "brightness(70%)" },
          }}
        >
          <AuthenticatedImage
            src={`/programs/${id}/thumbnail`}
            style={{
              objectFit: "cover",
            }}
            className="absolute rounded-t-md top-1/2 left-1/2 w-auto h-auto min-h-full min-w-full -translate-x-1/2 -translate-y-1/2"
          />
        </motion.div>
      </div>
      <div
        className="relative flex dark:bg-gray-800 bg-white rounded-b-md"
        style={{ height: 220 }}
      >
        <motion.div
          variants={{
            hover: {
              top: -40,
              transition: { duration: 0.2, type: "tween", ease: "easeOut" },
            },
          }}
          className="absolute dark:bg-gray-800 bg-white rounded-b-md w-full h-full top-0 left-0 p-4"
        >
          <h1 className="text-lg font-semibold line-clamp-1">{name}</h1>
          <p className="line-clamp-2 opacity-70 text-sm">{description}</p>
          <Pair label={`${length} Modules`} icon={RiNumbersLine} />
          {hover && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { delay: 0.05, duration: 0.3 },
                }}
                exit={{ opacity: 0, transition: { duration: 0 } }}
              >
                {isCompleted ? (
                  <Pair icon={FaCheck} label="Completed" />
                ) : (
                  <Pair icon={FaTimes} label="Uncompleted" />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Programs;
