import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { HTMLAttributes, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { twMerge } from "tailwind-merge";
import { Response } from "../../../../../api";
import { ModuleResponse } from "../../../../../api/module";
import {
  AssessmentSession,
  completeSession,
} from "../../../../../api/module/session";
import {
  answerQuestion,
  goToQuestion,
} from "../../../../../api/module/session/assessment";
import AuthenticatedImage from "../../../../../components/UI/AuthenticatedImage";
import Button from "../../../../../components/UI/Button";
import Modal from "../../../../../components/UI/Modal";
import ScoreCircle from "../../../../../components/UI/ScoreCircle";
import { useModuleSessionStore } from "../../../../../stores/module-sesion";
import { useEffect } from "react";

const NavigationButton: React.FC<
  HTMLAttributes<HTMLDivElement> & { disabled: boolean }
> = ({ className, disabled, onClick, ...props }) => {
  return (
    <div
      {...props}
      onClick={(e) => {
        if (!disabled && onClick) onClick(e);
      }}
      className={twMerge(
        `fixed select-none right-0 top-0 h-full w-14 bg-gray-300 bg-opacity-60 hover:bg-opacity-90 dark:bg-gray-600 dark:bg-opacity-40 dark:hover:bg-opacity-50 cursor-pointer flex items-center justify-center transition-colors ${
          className ?? ""
        } ${
          disabled
            ? "cursor-auto bg-gray-200 hover:bg-opacity-60 dark:bg-gray-800 dark:hover:bg-opacity-40"
            : ""
        }`
      )}
    ></div>
  );
};

const Assessment: React.FC = () => {
  const queryClient = useQueryClient();
  const onFinish = useModuleSessionStore((t) => t.onFinish);

  const moduleId = useModuleSessionStore((s) => s.module)!;
  const moduleData = queryClient.getQueryData<ModuleResponse>(["module"]);
  const queryKey = ["module", "session", moduleId];

  const sessionData =
    queryClient.getQueryData<Response<AssessmentSession>>(queryKey)!;

  const questions = sessionData.result.questions;
  const answers = sessionData.result.answers;
  const currentQuestion = sessionData.result.currentQuestion;

  const [score, setScore] = useState<number>();

  const { mutate: answerMutate } = useMutation(
    ({ answers, question }: { answers: number[]; question: string }) =>
      answerQuestion(moduleId, question, answers),
    {
      onMutate(v) {
        const newSessionData = { ...sessionData };
        const index = newSessionData.result.questions.findIndex(
          (q) => q.id === v.question
        );
        if (index == -1) return;

        newSessionData.result.answers[index] = v.answers;
        queryClient.setQueryData(queryKey, newSessionData);
      },
    }
  );

  const { mutate: goToMutate } = useMutation(
    (question: string) => goToQuestion(moduleId, question),
    {
      onMutate(v) {
        const newSessionData = { ...sessionData };
        const index = questions.findIndex((q) => q.id === v);
        if (index === -1) return;
        newSessionData.result.currentQuestion = index;
        queryClient.setQueryData(queryKey, newSessionData);
      },
      onSuccess(data, variables, context) {},
    }
  );

  const { mutate: completeMutate, isLoading: isLoadingComplete } = useMutation(
    () => completeSession(moduleId),
    {
      onSuccess(data) {
        setScore(data.result.score);
      },
    }
  );

  const progress = currentQuestion / questions.length;

  const onAnswer = (a: number[]) => {
    answerMutate({ answers: a, question: questions[currentQuestion].id });
  };

  const goTo = (step: number) => {
    goToMutate(questions[currentQuestion + step].id);
  };

  const complete = () => {
    completeMutate();
  };

  return (
    <div>
      {sessionData.result.maxTime && (
        <div className="relative flex items-center justify-center lg:top-8 lg:left-0 lg:absolute">
          <Timer
            start={new Date(sessionData.result.start)}
            total={sessionData.result.maxTime}
            onComplete={async () => {
              completeMutate();
            }}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={questions[currentQuestion].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.15 } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          <div className="w-9/12 mx-auto py-4 min-h-[calc(100vh-theme(space.32))] items-stretch flex flex-col">
            <Question
              key={questions[currentQuestion].id}
              onAnswer={onAnswer}
              question={questions[currentQuestion]}
              answers={answers[currentQuestion]}
            />
            {currentQuestion === questions.length - 1 && (
              <>
                <div className="flex-1" />
                <div>
                  <Button
                    disabled={
                      answers.some((a) => a == null || a?.length === 0) ||
                      answers.length === 0
                    }
                    isLoading={isLoadingComplete}
                    onClick={complete}
                    className="flex items-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:border-blue-400 bg-blue-500 hover:bg-blue-600 border-blue-400 text-white float-right disabled:bg-blue-600 dark:disabled:bg-blue-600 dark:disabled:border-blue-700"
                  >
                    Submit
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
      <NavigationButton
        disabled={currentQuestion === 0}
        className={`left-0`}
        onClick={() => {
          goTo(-1);
        }}
      >
        <IoIosArrowBack size={26} />
      </NavigationButton>
      <NavigationButton
        disabled={currentQuestion === questions.length - 1}
        onClick={() => {
          goTo(1);
        }}
      >
        <IoIosArrowForward size={26} />
      </NavigationButton>
      <AnimatePresence>
        {score !== undefined && (
          <motion.div
            initial={{
              x: "-100%",
            }}
            animate={{
              x: 0,
              transition: { duration: 0.5 },
            }}
            className="absolute w-full h-full top-0 left-0 bg-slate-700 flex flex-col items-center justify-center z-50"
          >
            <h1 className="text-4xl text-white">
              You Scored {Math.round(score * 100)}%
            </h1>
            <div className="h-6" />
            <Button onClick={() => onFinish()}>Continue</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Question: React.FC<{
  question: AssessmentSession["questions"]["0"];
  answers?: number[];
  onAnswer(answers: number[]): void;
}> = ({ question, answers = [], onAnswer }) => {
  return (
    <div>
      <h2 className="text-center text-2xl font-bold">{question.prompt}</h2>
      <div className="h-6" />
      {question.image && (
        <div className="flex flex-col items-center justify-center">
          <AuthenticatedImage src={question.image} className="max-h-72" />
          <div className="h-6" />
        </div>
      )}

      <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-x-4 gap-y-4">
        {question.options.map((option, i) => (
          <Button
            key={i}
            className={`py-3 rounded-md text-lg font-semibold ${
              answers?.includes(i)
                ? "dark:bg-primary-600 dark:hover:bg-primary-700 bg-primary-200 hover:bg-primary-300"
                : ""
            }`}
            onClick={() => {
              if (answers?.includes(i)) {
                onAnswer(answers?.filter((a) => a !== i));
              } else onAnswer([...(answers || []), i]);
            }}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};

const Timer: React.FC<{
  start: Date;
  total: number;
  onComplete: () => void;
}> = ({ start, total, onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(total);

  useEffect(() => {
    const val =
      total -
      Math.floor(Math.abs(start.getTime() - new Date().getTime()) / 1000);
    if (val < 0) {
      setIsOpen(true);
      setTimeLeft(0);
      return;
    }
    setTimeLeft(val);
    const interval = setInterval(() => {
      const val =
        total - Math.abs(start.getTime() - new Date().getTime()) / 1000;
      setTimeLeft(val);
      if (val <= 0) {
        clearInterval(interval);
        setIsOpen(true);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <ScoreCircle
        value={timeLeft.toFixed(0)}
        percentage={timeLeft / total}
        radius={55}
        fontSize="1.5rem"
      />
      <Modal isOpen={isOpen}>
        <div>
          <h1 className="font-bold text-lg">Time limit reached</h1>
          <p>Don't worry your answers will be taken into account</p>
          <div className="h-3"></div>
          <div className="float-right">
            <Button
              onClick={() => {
                onComplete();
              }}
            >
              Continue
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Assessment;
