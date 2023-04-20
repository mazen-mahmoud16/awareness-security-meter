import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { moduleQuery } from "../../../../api/module";
import { SessionInfoResponse } from "../../../../api/program/session";
import AuthenticatedImage from "../../../../components/UI/AuthenticatedImage";
import Button from "../../../../components/UI/Button";
import CenteredSpinner from "../../../../components/UI/CenteredSpinner";

const css = `
  .image {
    -webkit-mask-image: linear-gradient(to right, black 0%, transparent 100%);
    mask-image: linear-gradient(to right, black 0%, transparent 100%);
  }
`;

interface Props {}

const ProgramNextUp: React.FC<Props> = () => {
  const slug = useParams().slug!;
  const queryClient = useQueryClient();
  const response = queryClient.getQueryData<SessionInfoResponse>([
    "program",
    "session",
  ]);
  const navigate = useNavigate();
  const moduleId = response?.result.module;

  const { data, isLoading } = useQuery({
    ...moduleQuery(moduleId as any),
    enabled: !!moduleId,
  });

  if (isLoading) return <CenteredSpinner />;

  return (
    <div
      className="absolute left-0 min-h-[calc(100vh-theme(space.16))] top-16 w-full min-w-screen flex items-center justify-center overflow-hidden"
      style={{ zIndex: 100000 }}
    >
      <Helmet>
        <title>Next up | {data?.result.name}</title>
      </Helmet>
      <style>{css}</style>
      <div className="w-3/4 h-full absolute image top-0 left-0">
        <AuthenticatedImage
          style={{ objectFit: "cover" }}
          className="absolute top-1/2 left-1/2 w-auto h-auto min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none"
          src={`/modules/${moduleId}/thumbnail`}
        />
      </div>
      {/* Overlay */}
      <div className="bg-black opacity-80 dark:opacity-50 absolute w-full h-full top-0 left-0" />
      <div className="relative flex flex-col justify-center items-center w-96">
        <h1
          className="text-6xl font-bold dark:text-primary-500 text-primary-500 text-center"
          style={{ textShadow: "1px 2px 3px rgba(0,0,0,0.3)" }}
        >
          {data?.result.name}
        </h1>
        <div className="h-8" />
        <div className="flex justify-center">
          <Button
            onClick={async () => {
              navigate(`/programs/${slug}`);
            }}
          >
            Back to Program
          </Button>
          <div className="w-4" />

          <Button
            onClick={async () => {
              await queryClient.invalidateQueries(["module"]);
              navigate(`/programs/${slug}/session`);
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProgramNextUp;
