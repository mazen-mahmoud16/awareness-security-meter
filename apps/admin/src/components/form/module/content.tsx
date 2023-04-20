import React, { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { MdArrowBack } from "react-icons/md";
import { ModuleType } from "../../../api/module";
import Button from "../../../components/UI/Button";
import AssessmentEditor from "./assessment";
import PresentationEditor from "./presentation";
import VideoEditor from "./video";

interface Props {
  next(): void;
  previous(): void;
}

const Content: React.FC<Props> = ({ previous, next }) => {
  const { watch } = useFormContext();

  // @ts-ignore
  const t = watch("type");

  const Editor = useCallback(() => {
    switch (t) {
      case ModuleType.Assessment:
        return <AssessmentEditor />;
      case ModuleType.Presentation:
        return <PresentationEditor />;
      case ModuleType.Video:
        return <VideoEditor />;
      default:
        return <></>;
    }
  }, [t]);

  return (
    <div>
      <div className="flex justify-between items-stretch">
        <Button onClick={previous}>
          <MdArrowBack />
        </Button>
        <Button className="bg-primary-600 hover:bg-primary-700" onClick={next}>
          Next
        </Button>
      </div>
      <div className="h-6"></div>
      <Editor />
    </div>
  );
};

export default Content;
