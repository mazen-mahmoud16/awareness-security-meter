import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { MdCheck, MdClose, MdDelete } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteModule,
  moduleQuery,
  ModuleType,
} from "../../../../../api/module";
import {
  deleteModuleSession,
  moduleAvgScoreQuery,
  moduleUsersQuery,
} from "../../../../../api/tenant/stats";
import Button from "../../../../../components/UI/Button";
import ButtonWithModal from "../../../../../components/UI/ButtonWithModal";
import CenteredSpinner from "../../../../../components/UI/CenteredSpinner";
import Modal from "../../../../../components/UI/Modal";
import PaginationButtons from "../../../../../components/UI/PaginationButtons";
import ScoreCircle from "../../../../../components/UI/ScoreCircle";
import { moduleTypesIcons } from "../../../../../utils/constants";

interface Props {}

const ModuleStats: React.FC<Props> = () => {
  const { id, mid } = useParams();
  const { data, isLoading, isError } = useQuery(moduleQuery(mid!));
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: deleteMutation } = useMutation(
    async () => deleteModule(mid!),
    {
      async onSuccess() {
        await queryClient.invalidateQueries(["modules", id]);
        navigate(`/tenants/${id}/`);
      },
    }
  );

  if (isLoading) return <CenteredSpinner />;
  if (isError) {
    return <div>Module Not Found</div>;
  }
  if (!data) return <div>No Data</div>;

  const Icon = moduleTypesIcons[data.result.type];

  return (
    <div className="pt-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Icon size={28} className="text-primary-500" />
          <div className="w-4"></div>
          <h1 className="font-semibold text-2xl">{data.result.name}</h1>
        </div>
        <ButtonWithModal
          className="bg-red-400 hover:bg-red-500"
          onClick={() => {
            deleteMutation();
          }}
        >
          <MdDelete />
        </ButtonWithModal>
      </div>
      <div className="h-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 w-full">
        {[ModuleType.Assessment, ModuleType.Presentation].includes(
          data.result.type
        ) && <ModuleScore id={mid!} tenant={id!} />}
        <ModuleUsers tenant={id!} id={mid!} />
      </div>
    </div>
  );
};

const ModuleScore = ({ id, tenant }: { id: string; tenant: string }) => {
  const { data, isLoading } = useQuery(moduleAvgScoreQuery(id, tenant));

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

const ITEMS_PER_PAGE = 5;

const ModuleUsers = ({ id, tenant }: { id: string; tenant: string }) => {
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  var { data, isLoading, isPreviousData } = useQuery(
    moduleUsersQuery(id, tenant, {
      skip: page * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    })
  );
  const queryClient = useQueryClient();
  const { mutate: deleteMutation } = useMutation(
    async (user: string) => await deleteModuleSession(id, user, tenant),
    {
      async onSuccess() {
        await queryClient.invalidateQueries(["modules"]);
        setIsModalOpen(false);
      },
    }
  );
  const [currentUser, setCurrentUser] =
    useState<Exclude<typeof data, undefined>["result"][0]>();

  const navigate = useNavigate();

  if (isLoading) return <CenteredSpinner />;

  if (data?.result === undefined) return <>No Data</>;

  return (
    <div className="p-6 border rounded-md border-gray-400 border-opacity-30 flex flex-col items-center">
      <h1 className="font-bold text-3xl">Users</h1>
      <div className="h-6"></div>
      <div className="flex flex-col w-full">
        {data.result.map((u) => (
          <div
            key={u.id}
            className="rounded-md py-3 px-2 flex justify-between hover:bg-white hover:bg-opacity-5 cursor-pointer group relative"
            onClick={() => {
              setCurrentUser(u);
              setIsModalOpen(true);
            }}
          >
            <div className="flex items-center">
              <div className="w-2"></div>
              <h2>{u.name ?? u.email}</h2>
            </div>
            <div className="opacity-0 group-hover:opacity-70 transition-opacity text-sm">
              {new Date(u.start).toLocaleDateString()}
            </div>
            {u.score !== null && u.score !== undefined && (
              <div className="text-sm opacity-0 scale-0 group-hover:scale-100 group-hover:opacity-100 transition-all absolute bg-white bg-opacity-20 shadow-sm px-4 py-2 rounded-lg font-light -top-9 -right-6">
                Score {u.score * 100}%
              </div>
            )}
          </div>
        ))}
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
        {currentUser ? (
          <>
            <h1 className="font-bold text-2xl text-center">
              {currentUser.name}
            </h1>
            <div className="flex items-center justify-center opacity-70 text-primary-300">
              {currentUser.isCompleted ? (
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
              {currentUser.score !== null &&
                currentUser.score !== undefined && (
                  <div>Score: {currentUser.score * 100}%</div>
                )}
              <p>Started: {new Date(currentUser.start).toLocaleString()}</p>
              <p>Ended: {new Date(currentUser.end).toLocaleString()}</p>
            </div>
            <div className="h-5"></div>
            <div className="float-left">
              <ButtonWithModal
                className="bg-red-400 hover:bg-red-500"
                onClick={() => {
                  deleteMutation(currentUser.id);
                }}
              >
                Delete
              </ButtonWithModal>
            </div>
            <div className="float-right flex">
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <div className="w-4"></div>
              <Button
                onClick={() =>
                  navigate(`/tenants/${tenant}/users/${currentUser.id}`)
                }
              >
                Visit User
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

export default ModuleStats;
