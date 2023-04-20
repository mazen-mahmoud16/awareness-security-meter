import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { tenantQuery } from "../../../../api/tenant";
import {
  editTenantModule,
  TenantModuleInput,
  tenantModuleQuery,
} from "../../../../api/tenant/module";
import TenantModuleEditor from "../../../../components/form/tenant-module";
import CenteredSpinner from "../../../../components/UI/CenteredSpinner";

interface Props {}

const EditTenantModule: React.FC<Props> = () => {
  const id = useParams().id!;
  const mId = useParams().mid!;
  const { data: tenantData } = useQuery(tenantQuery(id));
  const { data, isLoading } = useQuery(tenantModuleQuery(id, mId));
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const onSubmit = async (input: TenantModuleInput) => {
    await editTenantModule(id, mId, input);
    await queryClient.invalidateQueries(["tenant-module", id, mId]);
    await queryClient.invalidateQueries(["tenant-modules"]);
  };

  if (isLoading) return <CenteredSpinner />;

  return (
    <TenantModuleEditor
      initialValues={data?.result as any as TenantModuleInput}
      tenantName={tenantData?.result.name!}
      onSubmit={onSubmit}
      onSuccess={() => {
        navigate(`/tenants/${id}/modules`);
      }}
    />
  );
};

export default EditTenantModule;
