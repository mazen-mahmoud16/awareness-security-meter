import { useAtom } from "jotai";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { trpc } from "../../api/trpc";
import CenteredSpinner from "../../components/UI/CenteredSpinner";
import PaginationButtons from "../../components/UI/PaginationButtons";
import Progress from "../../components/UI/Progress";
import ScoreCircle from "../../components/UI/ScoreCircle";
import { userAtom } from "../../stores/user";
import { moduleTypesIcons } from "../../utils/constants";

const Home = () => {
  const [{ user }] = useAtom(userAtom);
  return (
    <div>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="">
        <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-center mb-1">
          Welcome {user?.name ?? ""}
        </h1>
        <p className="text-center opacity-80 text-sm">{user?.department}</p>
      </div>
      <div className="h-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 w-full md:10/12 lg:w-9/12 mx-auto">
        <Score />
        <RecentModules />
        <div className="md:col-span-2">
          <RecentPrograms />
        </div>
      </div>
    </div>
  );
};

const Score = () => {
  const { data, isLoading } = trpc.user.home.avgScore.useQuery();

  if (isLoading) return <CenteredSpinner />;

  if (data === undefined) return <>No Data</>;

  return (
    <div className="p-7 border rounded-md border-gray-400 dark:border-opacity-30 border-opacity-40 flex flex-col items-center shadow-md">
      <h1 className="font-bold text-3xl">Average Score</h1>
      <div className="h-6"></div>
      <ScoreCircle percentage={data} />
    </div>
  );
};

const ITEMS_PER_PAGE = 3;

const RecentModules = () => {
  const [page, setPage] = useState(0);
  var { data, isLoading, isPreviousData } =
    trpc.user.home.recentModules.useQuery({
      skip: page * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    });

  const navigate = useNavigate();

  if (isLoading) return <CenteredSpinner />;

  if (!data) return <>No Data</>;

  return (
    <div className="p-6 border rounded-md border-gray-400 dark:border-opacity-30 border-opacity-40  flex flex-col items-center shadow-md">
      <h1 className="font-bold text-3xl">Recent Modules</h1>
      <div className="h-6"></div>
      <div className="flex flex-col w-full">
        {data.modules.map((module) => {
          const Icon = moduleTypesIcons[module.type];

          return (
            <div
              key={module.id}
              className="rounded-md py-3 px-2 flex justify-between hover:bg-white hover:bg-opacity-5 cursor-pointer group relative"
              onClick={() => {
                navigate(`/modules/${module.slug}`);
              }}
            >
              <div className="flex items-center">
                <Icon className="text-primary-400" />
                <div className="w-2"></div>
                <h2>{module.name}</h2>
              </div>
              <div className="opacity-0 group-hover:opacity-70 transition-opacity text-sm">
                {new Date(module.start).toLocaleDateString()}
              </div>
              {module.score !== null && module.score !== undefined && (
                <div className="text-sm opacity-0 scale-0 group-hover:scale-100 group-hover:opacity-100 transition-all absolute bg-white bg-opacity-20 shadow-sm px-4 py-2 rounded-lg font-light -top-9 -right-6">
                  Score {module.score * 100}%
                </div>
              )}
            </div>
          );
        })}
        {data.modules.length === 0 && (
          <p className="opacity-70 text-center">
            You're not enrolled for any modules yet.
          </p>
        )}
      </div>
      {data.modules.length !== 0 && (
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

const RecentPrograms = () => {
  const [page, setPage] = useState(0);
  var { data, isLoading, isPreviousData } =
    trpc.user.home.recentPrograms.useQuery({
      skip: page * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    });

  const navigate = useNavigate();

  if (isLoading) return <CenteredSpinner />;

  if (!data) return <>No Data</>;

  return (
    <div className="p-6 border rounded-md border-gray-400 dark:border-opacity-30 border-opacity-40  flex flex-col items-center shadow-md">
      <h1 className="font-bold text-3xl">Recent Programs</h1>
      <div className="h-6"></div>
      <div className="flex flex-col w-full">
        {data.map((program) => {
          return (
            <div
              key={program.id}
              className="py-3 px-2 flex flex-col justify-between cursor-pointer group relative"
              onClick={() => {
                navigate(`/programs/${program.slug}`);
              }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold group-hover:underline">
                  {program.name}
                </h2>
                <div className="w-4"></div>
                <p className="opacity-70 group-hover:opacity-100 transition-opacity">
                  {program.progress + 1}/{program.length}
                </p>
              </div>
              <div className="h-2"></div>
              <Progress
                value={(program.progress + 1) / program.length}
                min={0}
                max={1}
              />
            </div>
          );
        })}
        {data.length === 0 && (
          <p className="opacity-70 text-center">
            You're not enrolled for any programs yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
