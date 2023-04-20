import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { moduleQuery } from "../../../../api/module";
import { startSession } from "../../../../api/module/session";
import CenteredSpinner from "../../../../components/UI/CenteredSpinner";
import { useModuleSessionStore } from "../../../../stores/module-sesion";
import {
  moduleTypesComponents,
  moduleTypesNames,
} from "../../../../utils/constants";

import ErrorComponent from "../../../ErrorComponent";

interface Props {
  onFinish?(): void;
  onModuleAlreadyComplete?(): void;
  module?: string;
}

const ModuleSession: React.FC<Props> = ({
  onFinish,
  onModuleAlreadyComplete,
  module,
}) => {
  const slug = module || useParams().slug!;
  const setOnFinish = useModuleSessionStore((t) => t.setOnFinish);
  const setModuleId = useModuleSessionStore((t) => t.setModule);
  const mQuery = useQuery({
    ...moduleQuery(slug, ["module", slug]),
  });
  const navigate = useNavigate();

  const id = mQuery.data?.result.id;

  const { data, isLoading, error } = useQuery(
    ["module", "session", slug],
    async () => await startSession(id || slug),
    {
      async onError(err) {
        if ((err as any)?.error === "Already Completed") {
          if (onModuleAlreadyComplete) {
            onModuleAlreadyComplete();
          } else {
            navigate(`/modules/${mQuery.data?.result.slug ?? slug}`);
          }
        }
      },
      cacheTime: 0,
      enabled: !!id,
    }
  );

  useEffect(() => {
    setOnFinish(async () => {
      if (onFinish) {
        onFinish();
      } else {
        navigate(`/modules/${mQuery.data?.result.slug ?? slug}`);
      }
    });
  }, [mQuery.data, slug]);

  useEffect(() => {
    setModuleId(slug);
  }, [slug]);

  if (isLoading) return <CenteredSpinner />;

  if (!data || !mQuery.data) return <>No Data</>;

  if (error)
    return (
      <ErrorComponent
        message="An Unexpected Error Has Occurred"
        code="Oops"
        toMessage="Module"
        to={`/modules/${mQuery.data?.result.slug || slug}`}
      />
    );

  return (
    <>
      <Helmet>
        <title>
          {moduleTypesNames[mQuery.data.result.type]} |{" "}
          {mQuery.data.result.name}
        </title>
      </Helmet>
      {moduleTypesComponents[mQuery.data.result.type]}
    </>
  );
};

export default ModuleSession;
