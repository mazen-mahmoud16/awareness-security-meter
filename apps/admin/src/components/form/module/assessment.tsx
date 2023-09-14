import React, { KeyboardEvent, useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FiCheck, FiChevronRight } from "react-icons/fi";
import Button from "../../../components/UI/Button";
import Divider from "../../../components/UI/Divider";
import Input from "../../../components/UI/Input";
import InputLabel from "../../../components/UI/InputLabel";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import { FaClock } from "react-icons/fa";
import FileUploadButton from "../../file/FileUploadButton";
import Checkbox from "../../UI/Checkbox";
import { twMerge } from "tailwind-merge";

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

interface Props {}

const AssessmentEditor: React.FC<Props> = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "content.questions",
  });

  const createQuestion = (q: string) => {
    append({ prompt: q });
  };

  return (
    <div>
      <Metadata />
      <div className="h-6"></div>
      <InputLabel className="text-xl">Questions</InputLabel>
      <PromptCreator
        placeholder="Enter Question Prompt"
        onCreate={createQuestion}
      />
      <Divider />

      <div className="flex flex-col">
        <LayoutGroup>
          {(fields as any).map(
            (field: QuestionInput & { id: string }, idx: number) => (
              <Question
                index={idx}
                key={field.id}
                question={field}
                removeQuestion={() => {
                  remove(idx);
                }}
              />
            )
          )}
        </LayoutGroup>
      </div>
    </div>
  );
};

const Metadata = () => {
  const { setValue, watch, register } = useFormContext();

  const isRandom = watch("content.isRandom") || false;
  const questions = watch("content.questions") || [];
  const maxTime = watch("content.maxTime") || 0;
  const noOfRetries = watch("content.noOfRetries") || 1;

  const [isTimed, setIsTimed] = useState(!!maxTime);

  useEffect(() => {
    if (isRandom == false) {
      setValue("content.numberOfQuestions", undefined);
    }
    if (isTimed === false) {
      setValue("content.maxTime", undefined);
    }
  }, [isRandom, isTimed]);

  const TimeItem = ({
    children,
    time,
  }: {
    children: React.ReactNode;
    time: number;
  }) => {
    return (
      <div
        className={twMerge(
          `p-2 rounded-md shadow-md border border-gray-400 border-opacity-40 bg-gray-700 cursor-pointer hover:bg-gray-800 transition-colors flex items-center ${
            time === maxTime ? "bg-primary-700 hover:bg-primary-800" : ""
          }`
        )}
        onClick={() => setValue("content.maxTime", time)}
      >
        <FaClock />
        <div className="w-2"></div>
        <p>{children}</p>
      </div>
    );
  };

  return (
    <div>
      <Checkbox
        id="isRandom"
        checked={isRandom}
        onChange={(e) => {
          setValue("content.isRandom", !isRandom);
        }}
      >
        Is Random
      </Checkbox>
      <div className="h-4"></div>
      {isRandom && (
        <div>
          <InputLabel>Number of Questions</InputLabel>
          <Input
            {...register("content.numberOfQuestions", {
              valueAsNumber: true,
              max: questions.length,
            })}
            type="number"
            placeholder="Enter Number of Questions to be randomized"
          />
        </div>
      )}
      <div className="h-4"></div>
      <Checkbox
        id="isTimed"
        checked={isTimed}
        onChange={(e) => {
          setIsTimed(!isTimed);
        }}
      >
        Is Timed
      </Checkbox>
      <div className="h-4"></div>
      {isTimed && (
        <div className="flex flex-col space-y-3 md:flex-row md:space-x-2 md:space-y-0 md:items-center ">
          <TimeItem time={30}>30 seconds</TimeItem>
          <TimeItem time={60}>1 minute</TimeItem>
          <TimeItem time={5 * 60}>5 minutes</TimeItem>
          <TimeItem time={10 * 60}>10 minutes</TimeItem>

          <div className="h-4 md:h-0"></div>
          <div className="relative">
            <InputLabel className="absolute -top-6">Custom</InputLabel>
            <Input
              {...register("content.maxTime", {
                valueAsNumber: true,
                max: questions.length,
              })}
              className="w-auto"
              type="number"
              placeholder="Enter time in seconds"
            />
          </div>
        </div>
      )}
      <div className="h-4"></div>
      <InputLabel className="text-xl">Number of retries</InputLabel>
      <Input
        placeholder="Enter Number of retries"
        type="number"
        value={noOfRetries}
        onChange={(e) => {
            setValue("content.noOfRetries", parseInt(e.target.value));
        }}
      />
    </div>
  );
};

const PromptCreator: React.FC<{
  onCreate(q: string): void;
  placeholder?: string;
}> = ({ onCreate, placeholder }) => {
  const [prompt, setPrompt] = useState("");

  const createQuestion = () => {
    setPrompt("");
    onCreate(prompt);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") createQuestion();
  };

  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
        }}
        onKeyDown={onKeyDown}
      />
      <Button
        onClick={createQuestion}
        className="bg-gray-500 hover:bg-gray-600 absolute right-2 top-1/2 -translate-y-1/2"
      >
        <FiChevronRight />
      </Button>
    </div>
  );
};

const Question: React.FC<{
  question: QuestionInput;
  removeQuestion(): void;
  index: number;
}> = ({ question, removeQuestion, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { watch, setValue } = useFormContext();
  const optionsFieldName = `content.questions.${index}.options`;
  const answersFieldName = `content.questions.${index}.answers`;
  const imageFieldName = `content.questions.${index}.image`;

  const options: string[] = watch(optionsFieldName) ?? [];
  const answers: number[] = watch(answersFieldName) ?? [];
  const image: string = watch(imageFieldName);

  useEffect(() => {
    if (!options) setValue(optionsFieldName, []);
    if (!answers) setValue(answersFieldName, []);
  }, []);

  return (
    <LayoutGroup>
      <motion.div
        layout
        className={`bg-gray-700 ${
          !isOpen ? "hover:bg-gray-600 cursor-pointer" : ""
        } px-4 py-3 rounded-md transition-colors mb-4`}
        onClick={() => {
          if (!isOpen) setIsOpen(true);
        }}
      >
        <motion.div
          layout
          className="flex justify-between cursor-pointer px-1.5"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <motion.h3 layout="position" className="font-semibold text-lg">
            {question.prompt}
          </motion.h3>
          <motion.div layout="position">
            <Button
              className="bg-red-400 hover:bg-red-500"
              onClick={removeQuestion}
            >
              <MdDelete />
            </Button>
          </motion.div>
        </motion.div>
        <AnimatePresence presenceAffectsLayout>
          {isOpen && (
            <motion.div
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.15 } }}
            >
              <Divider />
              <FileUploadButton
                id={image}
                onChange={(id) => setValue(imageFieldName, id)}
              >
                Image
              </FileUploadButton>
              <Divider />
              {options.length < 4 && (
                <PromptCreator
                  placeholder="Enter Option"
                  onCreate={(o) => {
                    setValue(optionsFieldName, [...options, o]);
                  }}
                />
              )}
              <div className="flex flex-col px-2 pt-2">
                {options.map((option, i) => (
                  <Option
                    key={i}
                    option={option}
                    answer={answers.includes(i)}
                    toggleAnswer={() => {
                      const exists = answers.findIndex((a) => a === i);
                      if (exists == -1) {
                        setValue(answersFieldName, [...answers, i]);
                      } else {
                        const newAnswers = [...answers];
                        newAnswers.splice(exists, 1);
                        setValue(answersFieldName, newAnswers);
                      }
                    }}
                    deleteOption={() => {
                      const exists = answers.findIndex((a) => a === i);
                      if (exists !== -1) {
                        const newAnswers = [...answers];
                        newAnswers.splice(exists, 1);
                        setValue(answersFieldName, newAnswers);
                      }

                      const newOptions = [...options];
                      newOptions.splice(i, 1);
                      setValue(optionsFieldName, newOptions);
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
};

const Option: React.FC<{
  option: string;
  answer: boolean;
  toggleAnswer(): void;
  deleteOption(): void;
}> = ({ option, answer, toggleAnswer, deleteOption }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex py-2 items-center">
        <div
          onClick={toggleAnswer}
          className={`mr-2 cursor-pointer transition-colors ${
            answer ? "text-green-400" : "text-neutral-300"
          }`}
        >
          <FiCheck size={20} />
        </div>
        <p className="text-md font-semibold">{option}</p>
      </div>
      <Button className="bg-red-400 hover:bg-red-500" onClick={deleteOption}>
        <MdDelete />
      </Button>
    </div>
  );
};

export default AssessmentEditor;
