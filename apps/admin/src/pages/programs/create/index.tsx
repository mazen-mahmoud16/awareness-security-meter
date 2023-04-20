import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";
import { createProgram } from "../../../api/program";
import ProgramForm from "../../../components/form/program";

interface Props {}

const CreateProgram: React.FC<Props> = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onSuccess = async () => {
    await queryClient.invalidateQueries(["programs"]);
    navigate("/programs");
  };

  return <ProgramForm onSuccess={onSuccess} onSubmit={createProgram} />;
};

export default CreateProgram;
