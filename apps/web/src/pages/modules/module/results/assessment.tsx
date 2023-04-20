import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import {
  IoIosArrowForward,
  IoIosCheckmarkCircle,
  IoIosCloseCircle,
  IoMdCheckmark,
} from "react-icons/io";
import { ModuleResults } from "../../../../api/module";
import { arraysEqual } from "../../../../utils/arrays";

interface Props {
  results: ModuleResults;
}

const AssessmentResults: React.FC<Props> = ({
  results: { score, questions, answers },
}) => {
  return (
    <div>
      <h1 className="font-bold text-3xl text-center">{score * 100}%</h1>
      <div className="h-5"></div>
      {questions.map((q, i) => (
        <QuestionBlock question={q} answer={answers[i]} />
      ))}
    </div>
  );
};

const QuestionBlock: React.FC<{
  question: ModuleResults["questions"][0];
  answer: ModuleResults["answers"][0];
}> = ({ question, answer }) => {
  const isCorrect = useMemo(() => {
    if (answer?.length !== question.answers?.length) return false;
    return arraysEqual(answer, question.answers);
  }, [answer]);

  const [selected, setSelected] = useState(false);

  return (
    <motion.div
      className="border border-gray-400 border-opacity-40 shadow-md rounded-md p-6 cursor-pointer mb-4"
      whileHover={{ y: "-2px" }}
      layout
      onClick={() => {
        setSelected(!selected);
      }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <motion.div animate={{ rotateZ: selected ? "90deg" : "0deg" }}>
            <IoIosArrowForward />
          </motion.div>
          <div className="w-4"></div>
          <h3 className="font-semibold">{question.prompt}</h3>
        </div>
        {isCorrect ? (
          <IoIosCheckmarkCircle className="text-green-500" size={26} />
        ) : (
          <IoIosCloseCircle className="text-red-500" size={26} />
        )}
      </div>
      <AnimatePresence>
        {selected && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
              transition: { duration: 0.2 },
            }}
            exit={{
              opacity: 0,
              height: 0,
              transition: { opacity: { duration: 0 } },
            }}
          >
            <div className="flex flex-col items-stretch py-6">
              {question.options.map((option, idx) => (
                <div className="flex items-center">
                  <p
                    className={
                      answer?.includes(idx)
                        ? question.answers.includes(idx)
                          ? "text-green-500"
                          : "text-red-500"
                        : ""
                    }
                  >
                    {option}
                  </p>
                  <div className="w-2"></div>
                  {question.answers.includes(idx) && (
                    <IoMdCheckmark className="text-green-500" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AssessmentResults;
