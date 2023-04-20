import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { tenantQuery } from "../../../../api/tenant";
import {
  editTenantProgram,
  TenantProgramInput,
  tenantProgramQuery,
} from "../../../../api/tenant/program";
import TenantProgramEditor from "../../../../components/form/program-module";
import CenteredSpinner from "../../../../components/UI/CenteredSpinner";

interface Props {}

const EditTenantProgram: React.FC<Props> = () => {
  const id = useParams().id!;
  const pId = useParams().pid!;
  const { data: tenantData } = useQuery(tenantQuery(id));
  const { data, isLoading } = useQuery(tenantProgramQuery(id, pId));
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const onSubmit = async (input: TenantProgramInput) => {
    await editTenantProgram(id, pId, input);
    await queryClient.invalidateQueries(["tenant-program", id, pId]);
    await queryClient.invalidateQueries(["tenant-programs"]);
  };

  if (isLoading) return <CenteredSpinner />;

  return (
    <TenantProgramEditor
      initialValues={data?.result as any as TenantProgramInput}
      tenantName={tenantData?.result.name!}
      onSubmit={onSubmit}
      onSuccess={() => {
        navigate(`/tenants/${id}/programs`);
      }}
    />
  );
};

export default EditTenantProgram;
