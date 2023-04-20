import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { MdDelete, MdOutlineAdd } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { TenantResponse } from "../../../../api/tenant";
import { departmentsQuery } from "../../../../api/tenant/department";
import { deleteUser, usersQuery } from "../../../../api/tenant/user";
import ButtonWithModal from "../../../../components/UI/ButtonWithModal";
import CenteredSpinner from "../../../../components/UI/CenteredSpinner";
import EmptyListMessage from "../../../../components/UI/EmptyListMessage";
import FloatingActionButton from "../../../../components/UI/FloatingActionButton";
import Input from "../../../../components/UI/Input";
import InputLabel from "../../../../components/UI/InputLabel";
import Modal from "../../../../components/UI/Modal";
import PaginationButtons from "../../../../components/UI/PaginationButtons";
import Table from "../../../../components/UI/Table";
import BulkImport from "./components/BulkImport";
import CreateUser from "./create";

interface Props {}

const ITEMS_PER_PAGE = 15;

const Users: React.FC<Props> = () => {
  const id = useParams().id!;
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState<string>();
  const { data, isPreviousData, isLoading } = useQuery(
    usersQuery(
      id,
      {
        skip: page * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
        search,
      },
      department
    )
  );
  const { data: departmentsData, isLoading: isDepartmentsLoading } = useQuery(
    departmentsQuery(id)
  );

  const departmentOptions = useMemo(
    () => [
      { label: "None", value: "" },
      ...(departmentsData?.result.map((d) => ({ label: d, value: d })) || []),
    ],
    [departmentsData]
  );

  const [modal, setModal] = useState(false);
  const queryClient = useQueryClient();
  const tenantData = queryClient.getQueryData<TenantResponse>(["tenant", id]);

  return (
    <div className="pt-4">
      <Helmet>
        <title>{tenantData?.result.name || ""} | Users</title>
      </Helmet>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl">Users</h1>
        <BulkImport
          close={() => {
            queryClient.invalidateQueries(["users", id]);
          }}
        />
      </div>
      <div className="flex items-start justify-start my-4">
        <div>
          <InputLabel>Department</InputLabel>
          <Select
            className="my-react-select-container w-72"
            classNamePrefix="my-react-select"
            options={departmentOptions}
            isLoading={isDepartmentsLoading}
            placeholder="Select Department"
            onChange={(e) => {
              if (e) setDepartment(e.value);
            }}
          />
        </div>
        <div className="w-6" />
        <div>
          <InputLabel>Search</InputLabel>
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Search by name"
            className="py-2 w-72"
          />
        </div>
      </div>
      <Table
        headers={["Name", "Email", "Department", ""]}
        fields={["name", "email", "department", "actions"]}
        data={data?.result || []}
        onRowClick={(row) => {
          if (row?.id) navigate(row.id);
        }}
        customRender={{
          actions: (row) => (
            <div
              className="py-3 flex items-center justify-center z-50"
              onClick={async (e) => {
                e.stopPropagation();
              }}
            >
              <ButtonWithModal
                onClick={async (e) => {
                  console.log("nice");
                  e.stopPropagation();
                  await deleteUser(id, row.id);
                  queryClient.invalidateQueries(["users"]);
                }}
                className="bg-red-400 hover:bg-red-500"
              >
                <MdDelete />
              </ButtonWithModal>
            </div>
          ),
        }}
      />
      {isLoading && <CenteredSpinner />}
      <div className="h-4"></div>
      {data?.result.length === 0 && <EmptyListMessage entity="User" />}
      <div className="h-6"></div>
      <PaginationButtons
        page={page}
        setPage={setPage}
        hasMore={data?.hasMore}
        isPreviousData={isPreviousData}
      />
      <FloatingActionButton
        onClick={() => {
          setModal(true);
        }}
        icon={MdOutlineAdd}
      />
      <Modal
        className="h-auto"
        isOpen={modal}
        onRequestClose={() => {
          setModal(false);
        }}
      >
        <CreateUser
          close={() => {
            setModal(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default Users;
