import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Helmet } from "react-helmet";
import { FaClock } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { MdCheck, MdClose } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { moduleQuery } from "../../../api/module";
import AuthenticatedImage from "../../../components/UI/AuthenticatedImage";
import Button from "../../../components/UI/Button";
import CenteredSpinner from "../../../components/UI/CenteredSpinner";
import Pair from "../../../components/UI/Pair";
import {
  moduleTypesIcons,
  moduleTypesNames,
  restartableModules,
} from "../../../utils/constants";
import ErrorComponent from "../../ErrorComponent";

interface Props {}

const Module: React.FC<Props> = () => {
  const slug = useParams().slug!;
  const { data, isLoading, isError } = useQuery(moduleQuery(slug));
  const navigate = useNavigate();

  if (isLoading) return <CenteredSpinner />;

  if (isError)
    return (
      <ErrorComponent
        message="Module Not Found"
        toMessage="Go back to Modules"
        to="/modules"
      />
    );

  const module = data.result;

  const handleRetry = () => {
    navigate(`session`);
  };

  return (
    <div className="sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12 my-3 mx-auto px-6 ">
      <Helmet>
        <title>Module | {data.result.name}</title>
      </Helmet>
      <Button onClick={() => navigate("/modules")}>
        <IoIosArrowBack />
      </Button>
      <div className="w-full border dark:border-gray-400 dark:border-opacity-40 border-gray-500 border-opacity-40 shadow-md rounded-md mt-2">
        <div className="w-full h-96 relative rounded-t-md overflow-hidden">
          <AuthenticatedImage
            style={{
              objectFit: "cover",
            }}
            className="absolute top-1/2 left-1/2 w-auto h-auto min-h-full min-w-full -translate-x-1/2 -translate-y-1/2"
            src={`/modules/${module.id}/cover`}
          />
        </div>
        <div className="p-6">
          <h1 className="font-bold text-2xl mb-1">{module.name}</h1>
          <p className="font-light opacity-75 text-lg mb-2 line-clamp-4">
            {module.description}
          </p>
          <Pair
            icon={moduleTypesIcons[module.type]}
            label={moduleTypesNames[module.type]}
          />
          <Pair
            icon={module.isCompleted ? MdCheck : MdClose}
            label={module.isCompleted ? "Complete" : "Incomplete"}
          />
          <Pair icon={FaClock} label={`${module.duration} mins`} />
          <div className="h-2" />
          {!module.isCompleted ? (
            <Button onClick={() => navigate(`session`)}>Start Now</Button>
          ) : restartableModules.includes(module.type) ? (
            <Button onClick={() => navigate(`session`)}>Restart</Button>
          ) : (
            <>
              <Button onClick={() => navigate(`results`)}>View Results</Button>
              <br />
              {module.retriesLeft !== undefined && module.retriesLeft >= 1 && (
                <Button onClick={handleRetry}>
                  Retry ({module.retriesLeft} retries left)
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Module;
