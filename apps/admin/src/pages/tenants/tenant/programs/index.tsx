import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { TenantResponse } from "../../../../api/tenant";
import { tenantProgramsQuery } from "../../../../api/tenant/program";
import CenteredSpinner from "../../../../components/UI/CenteredSpinner";
import EmptyListMessage from "../../../../components/UI/EmptyListMessage";
import PaginationButtons from "../../../../components/UI/PaginationButtons";
import FloatingMultiActionButton from "./components/FloatingMulitActionButton";
import ProgramCard from "./components/ProgramCard";

interface Props {}

const Programs: React.FC<Props> = () => {
  const id = useParams().id!;
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  const { data, isPreviousData, isLoading } = useQuery(
    tenantProgramsQuery(id, {
      skip: 10 * page,
      take: 10,
      search,
    })
  );
  const queryClient = useQueryClient();
  const tenantData = queryClient.getQueryData<TenantResponse>(["tenant", id]);

  return (
    <div className="pt-4">
      <Helmet>
        <title>{tenantData?.result.name || ""} | Programs</title>
      </Helmet>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl pb-4">Exposed Programs</h1>
      </div>
      {isLoading && <CenteredSpinner />}
      {data?.result.length === 0 && (
        <EmptyListMessage entity="Exposed Programs" />
      )}
      {data?.result.map((m) => (
        <ProgramCard key={m.id} {...m} />
      ))}
      <PaginationButtons
        page={page}
        setPage={setPage}
        hasMore={data?.hasMore}
        isPreviousData={isPreviousData}
      />
      <FloatingMultiActionButton />
    </div>
  );
};

export default Programs;
