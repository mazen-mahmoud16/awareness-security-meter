import { useMutation, useQueryClient } from "@tanstack/react-query";
import Plyr from "plyr";
import "plyr-react/plyr.css";
import { useEffect, useState } from "react";
import { ModuleResponse } from "../../../../../api/module";
import { completeSession } from "../../../../../api/module/session";
import Button from "../../../../../components/UI/Button";
import { useModuleSessionStore } from "../../../../../stores/module-sesion";
import { BASE_API_URL } from "../../../../../utils/constants";

const Video: React.FC = () => {
  const queryClient = useQueryClient();
  const moduleId = useModuleSessionStore((s) => s.module)!;
  const module = queryClient.getQueryData<ModuleResponse>(["module"]);
  const [plyr, setPlyr] = useState<Plyr>();
  const [enableContinue, setEnableContinue] = useState(false);
  const onFinish = useModuleSessionStore((t) => t.onFinish);

  const { mutate } = useMutation(() => completeSession(moduleId), {
    onSuccess(data, variables, context) {
      onFinish();
    },
  });

  useEffect(() => {
    setPlyr(
      new Plyr("#plyr_video", {
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "captions",
          "settings",
          "airplay",
          "fullscreen",
        ],
      })
    );
  }, []);

  useEffect(() => {
    if (plyr) {
      plyr.on("timeupdate", function timeupdate(e) {
        if (e.detail.plyr.duration - e.detail.plyr.currentTime < 10) {
          setEnableContinue(true);
          plyr.off("timeupdate", timeupdate);
        }
      });
    }

    return () => plyr?.destroy();
  }, [plyr]);

  return (
    <div className="pb-12">
      <h1 className="text-2xl font-bold text-center"> {module?.result.name}</h1>
      <div className="h-8" />
      <div className="lg:w-7/12 md:9/12 sm:10/12  mx-auto">
        <video
          id="plyr_video"
          src={`${BASE_API_URL}/modules/${moduleId}/session/video/stream`}
          controls
        />
        <div className="h-8" />
        <Button
          disabled={!enableContinue}
          onClick={() => mutate()}
          className="dark:bg-primary-600 dark:hover:bg-primary-700 dark:border-primary-500 bg-primary-600 hover:bg-primary-700 border-primary-500 text-white disabled:bg-primary-700 dark:disabled:bg-primary-700 float-right"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Video;
