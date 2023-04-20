import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { tenantQuery } from "../../../../api/tenant";
import {
  createTenantModule,
  TenantModuleInput,
} from "../../../../api/tenant/module";
import TenantModuleEditor from "../../../../components/form/tenant-module";

interface Props {}

const ExposeModule: React.FC<Props> = () => {
  const id = useParams().id!;
  const { data } = useQuery(tenantQuery(id));
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onSubmit = async (input: TenantModuleInput) => {
    await createTenantModule(id, input);
    await queryClient.invalidateQueries(["tenant-modules"]);
  };

  return (
    <TenantModuleEditor
      tenantName={data?.result.name!}
      onSubmit={onSubmit}
      onSuccess={() => {
        navigate(`/tenants/${id}/modules`);
      }}
    />
  );
};

export default ExposeModule;
