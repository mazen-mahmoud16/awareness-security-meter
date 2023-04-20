import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import {
  MdCheck,
  MdClose,
  MdDelete,
  MdEdit,
  MdLock,
  MdOutlineGroups,
} from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteModuleSession,
  deleteProgramSession,
  userAvgScoreQuery,
  userModulesQuery,
  userProgramsQuery,
} from "../../../../../api/tenant/stats";
import { deleteUser, userQuery } from "../../../../../api/tenant/user";
import { trpc } from "../../../../../api/trpc";
import Button from "../../../../../components/UI/Button";
import ButtonWithModal from "../../../../../components/UI/ButtonWithModal";
import CenteredSpinner from "../../../../../components/UI/CenteredSpinner";
import Modal from "../../../../../components/UI/Modal";
import PaginationButtons from "../../../../../components/UI/PaginationButtons";
import Progress from "../../../../../components/UI/Progress";
import ScoreCircle from "../../../../../components/UI/ScoreCircle";
import {
  moduleTypesIcons,
  moduleTypesNames,
} from "../../../../../utils/constants";

interface Props {}

const User: React.FC<Props> = () => {
  const { id, uid } = useParams() as { id: string; uid: string };

  const { data, isLoading, isError } = trpc.admin.tenant.users.getUser.useQuery(
    uid!
  );

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: deleteMutation } = useMutation(
    async () => await deleteUser(id, uid),
    {
      async onSuccess() {
        await queryClient.invalidateQueries(["users", id]);
        navigate(`/tenants/${id}/users`);
      },
    }
  );

  if (isError) {
    return <div>User Not Found</div>;
  }

  if (isLoading) return <CenteredSpinner />;

  return (
    <div className="pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AiOutlineUser size={32} />
          <div className="w-4"></div>
          <h1 className="font-semibold text-2xl">{data?.name}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => {
              navigate("edit");
            }}
          >
            <MdEdit />
          </Button>
          <ButtonWithModal
            className="bg-red-400 hover:bg-red-500"
            onClick={() => {
              deleteMutation();
            }}
          >
            <MdDelete />
          </ButtonWithModal>
        </div>
      </div>
      <div className="h-4"></div>
      <div className="flex items-center px-1 opacity-80 hover:opacity-100 transition-opacity">
        <AiOutlineMail size={22} className="text-primary-400" />
        <div className="w-2"></div>
        <p>{data?.email}</p>
      </div>
      <div className="flex items-center px-1 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
        <MdOutlineGroups size={22} className="text-primary-400" />
        <div className="w-2"></div>
        <p>{data?.department}</p>
      </div>
      <Link
        to={
          data.authProvider
            ? `/tenants/${id}/auth/edit/${data.authProvider.id}`
            : `/tenants/${id}/auth`
        }
      >
        <div className="flex items-center px-1 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
          <MdLock size={22} className="text-primary-400" />
          <div className="w-2"></div>
          {data.authProvider ? (
            <p>
              {data.authProvider?.name} ({data.authProvider?.type})
            </p>
          ) : (
            <p>Default Auth</p>
          )}
        </div>
      </Link>
      <div className="h-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 w-full">
        <UserScore id={uid} tenant={id} />
        <UserModuleSessions id={uid} tenant={id} />
        <div className="md:col-span-2">
          <UserPrograms id={uid} tenant={id} />
        </div>
      </div>
    </div>
  );
};

const UserScore = ({ id, tenant }: { id: string; tenant: string }) => {
  const { data, isLoading } = useQuery(userAvgScoreQuery(id, tenant));

  if (isLoading) return <CenteredSpinner />;

  if (data?.result === undefined) return <>No Data</>;

  return (
    <div className="p-6 border rounded-md border-gray-400 border-opacity-30 flex flex-col items-center">
      <h1 className="font-bold text-3xl">Average Score</h1>
      <div className="h-6"></div>
      <ScoreCircle percentage={data.result} />
    </div>
  );
};

const ITEMS_PER_PAGE = 3;

const UserModuleSessions = ({ id, tenant }: { id: string; tenant: string }) => {
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  var { data, isLoading, isPreviousData } = useQuery(
    userModulesQuery(id, tenant, {
      skip: page * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    })
  );
  const queryClient = useQueryClient();
  const { mutate: deleteMutation } = useMutation(
    async (module: string) => await deleteModuleSession(module, id, tenant),
    {
      async onSuccess() {
        await queryClient.invalidateQueries(["users"]);
        setIsModalOpen(false);
      },
    }
  );
  const navigate = useNavigate();

  const [currentModule, setCurrentModule] =
    useState<Exclude<typeof data, undefined>["result"][0]>();

  if (isLoading) return <CenteredSpinner />;

  if (data?.result === undefined) return <>No Data</>;
  return (
    <div className="p-6 border rounded-md border-gray-400 border-opacity-30 flex flex-col items-center">
      <h1 className="font-bold text-3xl">Modules</h1>
      <div className="h-6"></div>
      <div className="flex flex-col w-full">
        {data.result.map((module) => {
          const Icon = moduleTypesIcons[module.type];

          return (
            <div
              key={module.id}
              className="rounded-md py-3 px-2 flex justify-between hover:bg-white hover:bg-opacity-5 cursor-pointer group relative"
              onClick={() => {
                setIsModalOpen(true);
                setCurrentModule(module);
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
        {data.result.length === 0 && (
          <p className="opacity-70 text-center">
            No Module Sessions for this user, yet.
          </p>
        )}
      </div>
      {data.result.length !== 0 && (
        <PaginationButtons
          page={page}
          setPage={setPage}
          hasMore={data.hasMore}
          isPreviousData={isPreviousData}
        />
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
        }}
      >
        {currentModule ? (
          <>
            <h1 className="font-bold text-2xl text-center">
              {currentModule.name}
            </h1>
            <div className="flex items-center justify-center opacity-70 text-primary-300">
              {currentModule.isCompleted ? (
                <>
                  <MdCheck />
                  <div className="w-2"></div>
                  <p>Completed</p>
                </>
              ) : (
                <>
                  <MdClose />
                  <div className="w-2"></div>
                  <p>In Progress</p>
                </>
              )}
            </div>
            <div className="h-5"></div>
            <div className="font-light opacity-80">
              {currentModule.score !== null &&
                currentModule.score !== undefined && (
                  <div>Score: {currentModule.score * 100}%</div>
                )}
              <p>Type: {moduleTypesNames[currentModule.type]}</p>
              <p>Started: {new Date(currentModule.start).toLocaleString()}</p>
              <p>Ended: {new Date(currentModule.end).toLocaleString()}</p>
            </div>
            <div className="h-5"></div>
            <div className="float-left flex">
              <ButtonWithModal
                onClick={async () => {
                  deleteMutation(currentModule.id);
                }}
                className="bg-red-400 hover:bg-red-500"
              >
                Delete
              </ButtonWithModal>
            </div>
            <div className="float-right flex">
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <div className="w-4"></div>
              <Button
                onClick={() =>
                  navigate(
                    `/tenants/${tenant}/modules/stats/${currentModule.id}`
                  )
                }
              >
                Visit Module
              </Button>
            </div>
          </>
        ) : (
          <div className="opacity-70">An Unexpected Error has occurred</div>
        )}
      </Modal>
    </div>
  );
};

const UserPrograms = ({ id, tenant }: { id: string; tenant: string }) => {
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  var { data, isLoading, isPreviousData, isError } = useQuery(
    userProgramsQuery(id, tenant, {
      skip: page * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    })
  );
  const { mutate: deleteMutation } = useMutation(
    async (program: string) => await deleteProgramSession(program, id, tenant),
    {
      async onSuccess() {
        await queryClient.invalidateQueries(["users"]);
        setIsModalOpen(false);
      },
    }
  );

  const navigate = useNavigate();

  const [currentProgram, setCurrentProgram] =
    useState<Exclude<typeof data, undefined>["result"][0]>();

  if (isLoading) return <CenteredSpinner />;

  if (data?.result === undefined) return <>No Data</>;
  return (
    <div className="p-6 border rounded-md border-gray-400 border-opacity-30 flex flex-col items-center">
      <h1 className="font-bold text-3xl">Programs</h1>
      <div className="h-6"></div>
      <div className="flex flex-col w-full">
        {data.result.map((program) => {
          return (
            <div
              key={program.id}
              className="py-3 px-2 flex flex-col justify-between cursor-pointer group relative"
              onClick={() => {
                setIsModalOpen(true);
                setCurrentProgram(program);
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
        {data.result.length === 0 && (
          <p className="opacity-70 text-center">
            No Program Sessions for this user, yet.
          </p>
        )}
      </div>
      {data.result.length !== 0 && (
        <PaginationButtons
          page={page}
          setPage={setPage}
          hasMore={data.hasMore}
          isPreviousData={isPreviousData}
        />
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
        }}
      >
        {currentProgram ? (
          <>
            <h1 className="font-bold text-2xl text-center">
              {currentProgram.name}
            </h1>
            <div className="flex items-center justify-center opacity-70 text-primary-300">
              {currentProgram.isCompleted ? (
                <>
                  <MdCheck />
                  <div className="w-2"></div>
                  <p>Completed</p>
                </>
              ) : (
                <>
                  <MdClose />
                  <div className="w-2"></div>
                  <p>In Progress</p>
                </>
              )}
            </div>
            <div className="h-5"></div>
            <div className="font-light opacity-80">
              <p>Started: {new Date(currentProgram.start).toLocaleString()}</p>
              <p>Ended: {new Date(currentProgram.end).toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-center opacity-70 text-primary-300"></div>
            <div className="h-5"></div>
            <div className="float-left flex">
              <ButtonWithModal
                onClick={async () => {
                  deleteMutation(currentProgram.id);
                }}
                className="bg-red-400 hover:bg-red-500"
              >
                Delete
              </ButtonWithModal>
            </div>
            <div className="float-right flex">
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <div className="w-4"></div>
              <Button
                onClick={() =>
                  navigate(
                    `/tenants/${tenant}/programs/stats/${currentProgram.id}`
                  )
                }
              >
                Visit Program
              </Button>
            </div>
          </>
        ) : (
          <div className="opacity-70">An Unexpected Error has occurred</div>
        )}
      </Modal>
    </div>
  );
};

export default User;
