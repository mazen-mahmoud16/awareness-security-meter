import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProgram, ProgramInput } from "../../../../api/program";
import ProgramForm from "../../../../components/form/program";

interface Props {}

const CreateProgramInTenant: React.FC<Props> = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const id = useParams().id!;

  return (
    <ProgramForm
      onSubmit={createProgram}
      onSuccess={async () => {
        await queryClient.invalidateQueries(["tenant-programs"]);
        navigate(`/tenants/${id}/programs`);
      }}
      initialValues={{ tenant: id } as ProgramInput}
    />
  );
};

export default CreateProgramInTenant;
