import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createModule, ModuleInput } from "../../../../api/module";
import ModuleForm from "../../../../components/form/module";

interface Props {}

const CreateModuleInTenant: React.FC<Props> = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const id = useParams().id!;

  return (
    <ModuleForm
      onSuccess={async () => {
        await queryClient.invalidateQueries(["tenant-modules"]);
        navigate(`/tenants/${id}/modules`);
      }}
      onSubmit={createModule}
      initialValues={{ tenant: id } as ModuleInput}
    />
  );
};

export default CreateModuleInTenant;
