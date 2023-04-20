import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editModule, ModuleInput, moduleQuery } from "../../../api/module";
import ModuleForm from "../../../components/form/module";
import CenteredSpinner from "../../../components/UI/CenteredSpinner";

interface Props {}

const EditModule: React.FC<Props> = () => {
  const id = useParams().id!;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data } = useQuery(moduleQuery(id));

  const onSubmit = async (input: ModuleInput) => {
    await editModule(id, input);
  };

  if (!data) return <CenteredSpinner />;

  return (
    <ModuleForm
      onSuccess={async () => {
        await queryClient.invalidateQueries(["modules"]);
        await queryClient.invalidateQueries(["module", id]);
        navigate("/modules");
      }}
      initialValues={data?.result}
      onSubmit={onSubmit}
      mode="edit"
    />
  );
};

export default EditModule;
