import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { MdDelete, MdEdit, MdOutlineAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { deleteModule, Module, modulesQuery, TYPES } from "../../api/module";
import { tenantNamesQuery } from "../../api/tenant";
import Button from "../../components/UI/Button";
import ButtonWithModal from "../../components/UI/ButtonWithModal";
import CenteredSpinner from "../../components/UI/CenteredSpinner";
import Divider from "../../components/UI/Divider";
import FloatingActionButton from "../../components/UI/FloatingActionButton";
import Input from "../../components/UI/Input";
import InputLabel from "../../components/UI/InputLabel";
import PaginationButtons from "../../components/UI/PaginationButtons";

interface Props {}

const ITEMS_PER_PAGE = 8;

const Modules: React.FC<Props> = () => {
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<string>();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const { data, isPreviousData, isLoading } = useQuery(
    modulesQuery(
      {
        skip: ITEMS_PER_PAGE * page,
        take: ITEMS_PER_PAGE,
        search,
      },
      tenant
    )
  );

  const { data: tenantNames } = useQuery(tenantNamesQuery());

  const options = useMemo(
    () => [
      { label: "All", value: undefined },
      { label: "None", value: "none" },
      ...(tenantNames?.result.map((n) => ({ label: n.name, value: n.id })) ||
        []),
    ],
    [tenantNames]
  );

  return (
    <div className="px-6 py-6">
      <Helmet>
        <title>Awareness Admin | Modules</title>
      </Helmet>
      <h1 className="font-bold text-3xl">Modules</h1>
      <div className="h-4" />
      <h2 className="font-semibold text-2xl">Filters</h2>
      <div className="flex items-start justify-start my-4">
        <div>
          <InputLabel>Tenant</InputLabel>
          <Select
            className="my-react-select-container w-72"
            classNamePrefix="my-react-select"
            options={options}
            placeholder={"Select Tenant"}
            onChange={(e) => {
              if (e) setTenant(e.value);
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
      <Divider />
      <div className="h-4" />
      {isLoading && <CenteredSpinner />}
      <div className="flex flex-col">
        {data?.result.map((m) => (
          <ModuleCard key={m.id} {...m} />
        ))}
      </div>
      <div className="h-4" />
      <PaginationButtons
        page={page}
        setPage={setPage}
        hasMore={data?.hasMore}
        isPreviousData={isPreviousData}
      />
      <FloatingActionButton
        onClick={() => {
          navigate("create");
        }}
        icon={MdOutlineAdd}
      />
    </div>
  );
};

const ModuleCard: React.FC<Module> = ({ name, description, type, id }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const typeName = useMemo(
    () => TYPES.find((t) => t.value === type)?.label,
    [type]
  );

  return (
    <div className="px-4 py-4 mb-4 border border-gray-500 border-opacity-30 rounded-md flex justify-between">
      <div className="w-1/2">
        <h1 className="text-xl font-bold">{name}</h1>
        <span className="font-semibold text-lg text-blue-400">{typeName}</span>
        <p className="opacity-70 line-clamp-2">{description}</p>
      </div>
      <div className="flex items-start">
        <Button
          onClick={() => {
            navigate(`edit/${id}`);
          }}
        >
          <MdEdit />
        </Button>
        <div className="w-2" />
        <ButtonWithModal
          onClick={async () => {
            await deleteModule(id);
            await queryClient.invalidateQueries(["modules"]);
          }}
          message="Are you sure you want to delete this module?"
          caption="This action is probably irreversible"
          className="bg-red-400 hover:bg-red-500"
        >
          <MdDelete />
        </ButtonWithModal>
      </div>
    </div>
  );
};

export default Modules;
