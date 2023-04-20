import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Helmet } from "react-helmet";
import { FaArrowRight } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { MdCheck, MdClose } from "react-icons/md";
import { RiNumbersLine } from "react-icons/ri";
import { Link, useNavigate, useParams } from "react-router-dom";
import { programModulesQuery, programQuery } from "../../../api/program";
import AuthenticatedImage from "../../../components/UI/AuthenticatedImage";
import Button from "../../../components/UI/Button";
import CenteredSpinner from "../../../components/UI/CenteredSpinner";
import Pair from "../../../components/UI/Pair";
import { moduleTypesIcons } from "../../../utils/constants";
import ErrorComponent from "../../ErrorComponent";

interface Props {}

const Program: React.FC<Props> = () => {
  const slug = useParams().slug!;
  const { data, isLoading, isError } = useQuery(programQuery(slug));
  const navigate = useNavigate();

  if (isLoading) return <CenteredSpinner />;

  if (isError)
    return (
      <ErrorComponent
        message="Program Not Found"
        toMessage="Go back to Programs"
        to="/programs"
      />
    );

  const program = data.result;

  return (
    <div className="sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12 my-3 mx-auto px-6 ">
      <Helmet>
        <title>Program | {data.result.name}</title>
      </Helmet>
      <Button onClick={() => navigate("/programs")}>
        <IoIosArrowBack />
      </Button>
      <div className="w-full border dark:border-gray-400 dark:border-opacity-40 border-gray-500 border-opacity-40 shadow-md rounded-md mt-2">
        <div className="w-full h-96 relative rounded-t-md overflow-hidden">
          <AuthenticatedImage
            style={{
              objectFit: "cover",
            }}
            className="absolute top-1/2 left-1/2 w-auto h-auto min-h-full min-w-full -translate-x-1/2 -translate-y-1/2"
            src={`/programs/${program.id}/cover`}
          />
        </div>
        <div className="p-6">
          <h1 className="font-bold text-2xl mb-1">{program.name}</h1>
          <p className="font-light opacity-75 text-lg mb-2 line-clamp-4">
            {program.description}
          </p>
          <Pair
            icon={program.isCompleted ? MdCheck : MdClose}
            label={program.isCompleted ? "Complete" : "Incomplete"}
          />
          <Pair icon={RiNumbersLine} label={`${program.length} Modules`} />
          <div className="h-2" />
          {!program.isCompleted && (
            <Button onClick={() => navigate(`session`)}>
              {!program.progress ? "Start Now" : "Continue"}
            </Button>
          )}
        </div>
      </div>
      <div className="h-4" />
      <Modules progress={program.progress || 0} />
    </div>
  );
};

const Modules = ({ progress }: { progress: number }) => {
  const slug = useParams().slug!;
  const { data, isLoading } = useQuery(programModulesQuery(slug));

  if (isLoading) return <CenteredSpinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-6">Path</h1>
      <div className="flex flex-col items-center">
        <div className="w-1 h-8 rounded-lg dark:bg-white bg-black mb-2 bg-opacity-60"></div>
        {data?.result.map((m, i) => {
          const Icon = moduleTypesIcons[m.type];
          return (
            <>
              <div className="w-9/12 mb-2 relative">
                {i == progress && (
                  <div className="absolute inset-0 bg-primary-600 dark:bg-primary-600 rounded-sm blur opacity-50" />
                )}
                {i == progress && (
                  <FaArrowRight className="absolute -left-10 top-1/2 -translate-y-1/2" />
                )}
                <div className="px-4 py-4 dark:bg-gray-900 bg-white relative rounded-md grid grid-cols-2 lg:grid-cols-3 overflow-hidden border dark:border-gray-400 dark:border-opacity-40 border-gray-500 border-opacity-40 shadow-md">
                  <div className="relative">
                    <h2 className="font-semibold">{m.name}</h2>
                    <p className="opacity line-clamp-1 w-48">{m.description}</p>
                  </div>
                  <div className="flex items-center justify-end lg:justify-center relative">
                    <Link to={`/modules/${m.id}`}>
                      <Button className="rounded-full transition-all w-12 h-12 text-white dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800  dark:border-green-800 border-green-700 bg-primary-600 hover:bg-primary-700 focus:ring-primary-700 flex items-center justify-center">
                        <Icon size={26} />
                      </Button>
                    </Link>
                  </div>
                  <div className="relative hidden lg:block">
                    <div className="w-32 h-full absolute rounded-r-md -right-4 top-0">
                      <AuthenticatedImage
                        style={{
                          objectFit: "cover",
                        }}
                        className="absolute top-1/2 left-1/2 w-auto h-auto min-h-full min-w-full -translate-x-1/2 -translate-y-1/2"
                        src={`/modules/${m.id}/thumbnail`}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-1 h-8 rounded-lg dark:bg-white bg-black mb-2 bg-opacity-60"></div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default Program;
