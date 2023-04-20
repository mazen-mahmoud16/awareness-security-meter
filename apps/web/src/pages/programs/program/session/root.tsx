import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { programQuery } from "../../../../api/program";
import { nextModule, startSession } from "../../../../api/program/session";
import CenteredSpinner from "../../../../components/UI/CenteredSpinner";
import ErrorComponent from "../../../ErrorComponent";

export interface ProgramSessionOutletContext {
  next(): Promise<void>;
}

const ProgramSessionRoot: React.FC = () => {
  const slug = useParams().slug!;
  const queryClient = useQueryClient();
  const qQuery = useQuery({
    ...programQuery(slug),
    onSuccess(data) {},
  });

  const navigate = useNavigate();

  const id = qQuery.data?.result.id;

  const { data, isLoading, error } = useQuery(
    ["program", "session"],
    async () => await startSession(id || slug),
    {
      async onError(err) {
        if ((err as any)?.error === "Already Completed") {
          navigate(`/programs/${slug}/completed`);
        }
      },
      enabled: !!id,
    }
  );

  const { mutate } = useMutation(async () => nextModule(id || slug), {
    async onSuccess(res) {
      await queryClient.invalidateQueries(["program", "session"]);
      if (res.message !== "Program Completed") {
        navigate(`next`);
      }
    },
    onError(err) {
      if ((err as any)?.error === "Module Not Completed") {
        navigate(`/programs/${qQuery.data?.result.slug ?? slug}`);
      }
    },
  });

  if (isLoading) return <CenteredSpinner />;

  if (error)
    return (
      <ErrorComponent
        message="An Unexpected Error Has Occurred"
        code="Oops"
        toMessage="Module"
        to={`/modules/${qQuery.data?.result.slug || slug}`}
      />
    );

  return (
    <Outlet
      context={
        {
          next() {
            mutate();
          },
        } as ProgramSessionOutletContext
      }
    />
  );
};

export default ProgramSessionRoot;
