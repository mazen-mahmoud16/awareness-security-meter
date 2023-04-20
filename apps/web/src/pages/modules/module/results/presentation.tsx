import React from "react";
import { ModuleResults } from "../../../../api/module";

interface Props {
  results: ModuleResults;
}

const PresentationResults: React.FC<Props> = ({
  results: { score, questions, answers },
}) => {
  return <div></div>;
};

export default PresentationResults;
