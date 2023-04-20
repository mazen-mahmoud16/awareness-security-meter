import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { moduleQuery, ModuleType, resultsQuery } from "../../../../api/module";
import CenteredSpinner from "../../../../components/UI/CenteredSpinner";
import {
  moduleTypesNames,
  restartableModules,
} from "../../../../utils/constants";
import AssessmentResults from "./assessment";
import PresentationResults from "./presentation";

interface Props {}

const ModuleResults: React.FC<Props> = () => {
  const slug = useParams().slug!;
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery(moduleQuery(slug));
  const { data: resultData, isLoading: isLoadingResult } = useQuery({
    ...resultsQuery(data?.result.id!),
    enabled: !!data?.result.id,
  });

  useEffect(() => {
    if (data)
      if (restartableModules.includes(data.result.type)) {
        navigate(`/modules/${data.result.id}`);
      }
  }, [data?.result.type]);

  if (isLoading) return <CenteredSpinner />;

  if (isError) return <div>Error</div>;

  const Results = () => {
    switch (data?.result.type) {
      case ModuleType.Assessment:
        return <AssessmentResults results={resultData?.result!} />;
      case ModuleType.Presentation:
        return <PresentationResults results={resultData?.result!} />;
      default:
        return <div>Unknown Module Type</div>;
    }
  };

  return (
    <div>
      <Helmet>
        <title>Results | {data.result.name}</title>
      </Helmet>
      <div className="text-center pb-8">
        <h1 className="font-bold text-4xl">{data.result.name}</h1>
        <p className="dark:text-primary-400 text-primary-500 font-semibold text-lg">
          {moduleTypesNames[data.result.type]}
        </p>
      </div>
      {isLoadingResult ? <CenteredSpinner /> : <Results />}
    </div>
  );
};

export default ModuleResults;
