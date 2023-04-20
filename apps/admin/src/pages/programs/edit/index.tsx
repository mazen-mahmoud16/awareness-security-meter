import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editProgram, programQuery } from "../../../api/program";
import ProgramForm from "../../../components/form/program";
import CenteredSpinner from "../../../components/UI/CenteredSpinner";

interface Props {}

const EditProgram: React.FC<Props> = () => {
  const id = useParams().id!;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data } = useQuery(programQuery(id));

  const onSuccess = async () => {
    await queryClient.invalidateQueries(["programs"]);
    await queryClient.invalidateQueries(["program", id]);

    navigate("/programs");
  };

  if (!data) return <CenteredSpinner />;

  return (
    <ProgramForm
      onSuccess={onSuccess}
      onSubmit={async (input) => await editProgram(id, input)}
      initialValues={data.result}
      mode="edit"
    />
  );
};

export default EditProgram;
