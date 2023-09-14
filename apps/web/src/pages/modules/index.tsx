import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { FaCheck, FaClock, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { Module, modulesQuery, ModuleType } from "../../api/module";
import AuthenticatedImage from "../../components/UI/AuthenticatedImage";
import CenteredSpinner from "../../components/UI/CenteredSpinner";
import EmptyListMessage from "../../components/UI/EmptyListMessage";
import Input from "../../components/UI/Input";
import InputLabel from "../../components/UI/InputLabel";
import PaginationButtons from "../../components/UI/PaginationButtons";
import Pair from "../../components/UI/Pair";
import {
  moduleTypesIcons,
  moduleTypesNames,
  TYPES,
} from "../../utils/constants";

const typeOptions = [{ label: "None", value: 0 }, ...TYPES];

const ITEMS_PER_PAGE = 6;

const Modules = () => {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<ModuleType>();
  const { data, isLoading, isPreviousData } = useQuery(
    modulesQuery(
      { skip: page * ITEMS_PER_PAGE, take: ITEMS_PER_PAGE, search },
      type
    )
  );
  return (
    <div>
      <Helmet>
        <title>Modules</title>
      </Helmet>
      <h1 className="text-4xl font-bold text-center">Modules</h1>
      <div className="h-8"></div>
      <div className="w-9/12 lg:w-6/12 md:w-8/12 mx-auto flex items-center">
        <div className="flex-1">
          <InputLabel>Search</InputLabel>
          <Input
            placeholder="Search"
            className="rounded-full px-4 "
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </div>
        <div className="w-4"></div>
        <div className="flex-1">
          <InputLabel>Type</InputLabel>
          <Select
            placeholder="Select Type"
            className="my-react-select-container"
            classNamePrefix="my-react-select"
            options={typeOptions}
            onChange={(e) => setType(e?.value)}
          />
        </div>
      </div>
      <div className="h-14"></div>
      {data && data.result.length === 0 && <EmptyListMessage entity="Module" />}
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

const Card: React.FC<Module> = ({
  id,
  name,
  duration,
  type,
  isCompleted,
  slug,
  content,
}) => {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();
  return (
    <motion.div
      onClick={() => navigate(slug)}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      className="h-96 w-72 border rounded-md shadow-md cursor-pointer flex flex-col dark:border-gray-400 dark:border-opacity-40 border-gray-800 border-opacity-25 relative"
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
            src={`/modules/${id}/thumbnail`}
            style={{
              objectFit: "cover",
            }}
            className="absolute rounded-t-md top-1/2 left-1/2 w-auto h-auto min-h-full min-w-full -translate-x-1/2 -translate-y-1/2"
          />
        </motion.div>
      </div>
      <div
        className="relative flex dark:bg-gray-800 bg-white rounded-b-md"
        style={{ height: 185 }}
      >
        <motion.div
          variants={{
            hover: {
              top: -70,
              transition: { duration: 0.2, type: "tween", ease: "easeOut" },
            },
          }}
          className="absolute dark:bg-gray-800 bg-white rounded-b-md w-full h-full top-0 left-0 p-4"
        >
          <h1 className="text-lg font-semibold line-clamp-2">{name}</h1>
          <Pair label={moduleTypesNames[type]} icon={moduleTypesIcons[type]} />
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
                <Pair label={`${duration} mins`} icon={FaClock} />
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

export default Modules;
