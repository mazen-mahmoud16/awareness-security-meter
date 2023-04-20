import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { tenantQuery } from "../../../../api/tenant";
import {
  createTenantProgram,
  TenantProgramInput,
} from "../../../../api/tenant/program";
import TenantProgramEditor from "../../../../components/form/program-module";

interface Props {}

const ExposeProgram: React.FC<Props> = () => {
  const id = useParams().id!;
  const { data } = useQuery(tenantQuery(id));
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onSubmit = async (input: TenantProgramInput) => {
    await createTenantProgram(id, input);
    await queryClient.invalidateQueries(["tenant-programs"]);
  };

  return (
    <TenantProgramEditor
      tenantName={data?.result.name!}
      onSubmit={onSubmit}
      onSuccess={() => {
        navigate(`/tenants/${id}/programs`);
      }}
    />
  );
};

export default ExposeProgram;
