import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { SessionInfoResponse } from "../../../../api/program/session";
import ModuleSession from "../../../modules/module/session";
import { ProgramSessionOutletContext } from "./root";

interface Props {}

const ProgramSession: React.FC<Props> = () => {
  const { next } = useOutletContext<ProgramSessionOutletContext>();
  const queryClient = useQueryClient();
  const response = queryClient.getQueryData<SessionInfoResponse>([
    "program",
    "session",
  ]);

  const moduleId = response?.result.module;

  return (
    <>
      <ModuleSession
        key={moduleId}
        onFinish={async () => {
          await next();
        }}
        onModuleAlreadyComplete={next}
        module={moduleId as any}
      />
    </>
  );
};

export default ProgramSession;
