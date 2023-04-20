import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FiCheck } from "react-icons/fi";
import { MdArrowBack, MdEdit, MdOutlineArrowDownward } from "react-icons/md";
import Select from "react-select";
import type { CreateModuleStep } from ".";
import { videoQuery } from "../../../api/content";
import { ModuleInput, ModuleType, TYPES } from "../../../api/module";
import { tenantNamesQuery } from "../../../api/tenant";
import Button from "../../../components/UI/Button";
import Divider from "../../../components/UI/Divider";
import { formatBytes, seconds2time } from "../../../utils/parse";
import InputLabel from "../../UI/InputLabel";

export interface VideoModuleInput {
  content: {
    video: string;
    provider?: string;
  };
}

export interface QuestionInput {
  prompt: string;
  options: string[];
  isMulti?: boolean;
  answers: number[];
  image: string;
  translations: {
    [locale: string]: {
      prompt: string;
      options: string[];
    };
  };
}

interface Props {
  goTo(e: CreateModuleStep): void;
  submit(): void;
}

const Overview: React.FC<Props> = ({ goTo, submit }) => {
  const { getValues, setValue, watch } = useFormContext<ModuleInput>();

  const { name, description, duration, type, content } = getValues();

  // @ts-ignore
  const tenant = watch("tenant");

  const typeName = useMemo(
    () => TYPES.find((t) => t.value === type)?.label,
    [type]
  );

  const { data: tenantNames } = useQuery(tenantNamesQuery());

  const options = useMemo(
    () => [
      { label: "None", value: undefined },
      ...(tenantNames?.result.map((n) => ({ label: n.name, value: n.id })) ||
        []),
    ],
    [tenantNames]
  );

  return (
    <LayoutGroup>
      <motion.div layout>
        <motion.div
          layout="position"
          className="flex justify-between items-stretch"
        >
          <Button onClick={() => goTo("content")}>
            <MdArrowBack />
          </Button>
        </motion.div>
        <div className="h-4" />
        <motion.div
          layout="position"
          className="grid md:grid-cols-4 gap-2 sm:grid-cols-2 place-items-start"
        >
          <h1 className="text-4xl font-bold">Overview</h1>
          <Button onClick={() => goTo("info")}>
            <MdEdit />
          </Button>
        </motion.div>
        <div className="h-4" />
        <motion.div layout="position">
          <InputLabel>Tenant</InputLabel>
          <Select
            className="my-react-select-container w-72"
            classNamePrefix="my-react-select"
            options={options}
            placeholder={"Select Tenant"}
            value={options.find((o) => o.value === tenant)}
            onChange={(e) => {
              // @ts-ignore
              if (e) setValue("tenant", e.value);
            }}
          />
        </motion.div>
        <div className="h-4" />
        <motion.div layout="position" className="text-3xl font-semibold">
          Info
        </motion.div>
        <div className="h-4" />
        <motion.dl layout="position">
          <KeyValue label="Name" value={name ? name : "Undefined"} />
          <KeyValue
            label="Description"
            value={description ? description : "Undefined"}
          />
          <KeyValue
            label="Duration"
            value={duration ? `${duration} minutes` : "Undefined"}
          />
          <KeyValue label="Type" value={typeName || ""} />
        </motion.dl>
        <Divider />
        <motion.div
          layout="position"
          className="grid md:grid-cols-4 gap-2 sm:grid-cols-2 place-items-start"
        >
          <h1 className="text-4xl font-bold">Content</h1>
          <Button onClick={() => goTo("content")}>
            <MdEdit />
          </Button>
        </motion.div>
        <div className="h-4" />
        <ContentOverview type={type} content={content} />
        <Divider />
        <motion.div layout="position">
          <Button
            layout="position"
            className="bg-primary-600 hover:bg-primary-700 float-right"
            onClick={() => {
              // TODO: Validate
              submit();
            }}
          >
            Submit
          </Button>
        </motion.div>
        <div className="mb-12"></div>
      </motion.div>
    </LayoutGroup>
  );
};

const KeyValue: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  return (
    <div className="grid md:grid-cols-4 gap-2 sm:grid-cols-2 py-2">
      <dt className="font-semibold">{label}</dt>
      <dd className="opacity-70">{value}</dd>
    </div>
  );
};

const ContentOverview: React.FC<{
  content: ModuleInput["content"];
  type: ModuleType;
}> = ({ type, content }) => {
  switch (type) {
    case ModuleType.Assessment:
      return (
        <motion.div>
          <motion.h2 layout="position" className="font-semibold text-xl">
            Questions
          </motion.h2>
          <LayoutGroup>
            {(content as any)?.questions?.map((q: any, i: any) => (
              <QuestionViewer key={i} {...q} />
            ))}
          </LayoutGroup>
        </motion.div>
      );
    case ModuleType.Video:
      return (
        <VideoViewer video={(content as VideoModuleInput["content"]).video} />
      );
    default:
      return <p className="opacity-70">TODO</p>;
  }
};

const QuestionViewer: React.FC<QuestionInput> = ({
  prompt,
  options,
  answers,
}) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <motion.div layout className="py-2 my-2">
      <motion.div layout="position" className="flex items-center">
        <p>{prompt}</p>
        <div className="w-6"></div>
        <Button onClick={() => setOpen(!isOpen)}>
          <MdOutlineArrowDownward />
        </Button>
      </motion.div>
      <AnimatePresence presenceAffectsLayout>
        {isOpen && (
          <motion.div>
            {options.map((option, idx) => (
              <motion.div key={idx} className="flex items-center">
                <p>{option}</p>
                {answers?.includes(idx as never) && (
                  <FiCheck size={20} className="ml-2 text-green-600" />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const VideoViewer: React.FC<{ video: string }> = ({ video }) => {
  const { data } = useQuery(videoQuery(video));

  return (
    <div>
      <KeyValue label="Name" value={data?.result.name!} />
      <KeyValue label="Size" value={formatBytes(data?.result.size!)} />
      <KeyValue
        label="Duration"
        value={seconds2time(Math.round(data?.result.duration!))}
      />
      <div className="h-4"></div>
      <Button>View Video</Button>
    </div>
  );
};

export default Overview;
