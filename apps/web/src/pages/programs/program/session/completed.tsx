import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { ProgramResponse } from "../../../../api/program";
import Button from "../../../../components/UI/Button";

interface Props {}

const CompletedProgram: React.FC<Props> = () => {
  const navigate = useNavigate();
  const slug = useParams().slug!;

  return (
    <div className="flex flex-col items-center mt-8">
      <Helmet>
        <title>Program Completed</title>
      </Helmet>
      <h1 className="text-6xl font-bold">Congratulations</h1>
      <div className="h-4" />
      <p className="text-3xl font-light">
        You have successfully completed this program
      </p>
      <div className="h-4" />
      <Button
        className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        onClick={() => navigate(`/programs/${slug}`)}
      >
        Continue
      </Button>
    </div>
  );
};

export default CompletedProgram;
