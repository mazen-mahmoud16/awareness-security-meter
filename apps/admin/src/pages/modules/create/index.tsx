import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";
import { createModule, ModuleInput } from "../../../api/module";
import ModuleForm from "../../../components/form/module";

interface Props {}

const CreateModule: React.FC<Props> = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (
    <ModuleForm
      onSuccess={async () => {
        await queryClient.invalidateQueries(["modules"]);
        navigate("/modules");
      }}
      onSubmit={createModule}
    />
  );
};

export default CreateModule;
