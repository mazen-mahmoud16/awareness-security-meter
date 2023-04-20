import { Types } from "mongoose";
import { HttpError } from "../../lib/error/HttpError";
import getShuffledArr from "../../lib/util/getShuffledArray";
import {
  AssessmentModule,
  Module,
  PresentationModule,
  SlideType,
  User,
} from "../../models";
import ModuleSessionModel, {
  AssessmentSessionContent,
  ModuleSession,
  ModuleSessionInput,
  PresentationSessionContent,
} from "../../models/module/session";

export const getQuestions = (
  questionIds: Types.ObjectId[],
  questions: AssessmentModule["content"]["questions"],
  moduleId: string,
  deleteAnswers = false
) => {
  return questionIds.map((qId) => {
    const question = questions.find(
      (q) =>
        q._id?.toString() == qId.toString() ||
        q.id?.toString() == qId.toString()
    );
    if (question) {
      question.id = question?._id.toString();
      question.image = (
        question.image
          ? `/modules/${moduleId}/session/assessment/image/${question.id}`
          : undefined
      ) as any;
      // @ts-ignore
      if (deleteAnswers) delete question.answers;
    }
    delete question?._id;
    return question;
  });
};

export async function findSession(
  user: string,
  module: string,
  options: { exclude?: string[] } = {}
) {
  return await ModuleSessionModel.findOne({
    module,
    user,
  }).select(options.exclude?.map((e) => `-${e}`).join(" ") || "");
}

export async function createSession<T>(input: ModuleSessionInput<T>) {
  return await ModuleSessionModel.create(input);
}

export async function startAssessment(
  module: Module,
  session: ModuleSession,
  user: User
) {
  const content = module.content as AssessmentModule["content"];
  var questions = content.questions;

  if (!session) {
    if (content.isRandom) questions = getShuffledArr(questions);
    if (module.content.numberOfQuestions)
      questions = questions.slice(0, module.content.numberOfQuestions);

    const newSession = await createSession<AssessmentSessionContent>({
      module: module.id,
      user: user.id,
      type: module.type,
      isCompleted: false,
      content: {
        questions: questions.map((q) => q._id),
        currentQuestion: 0,
        answers: [],
      },
    });

    return {
      ...newSession.content,
      questions: getQuestions(
        (newSession.content as AssessmentSessionContent).questions as any,
        questions,
        module.id,
        true
      ),
      start: newSession.start,
      maxTime: content.maxTime,
    };
  }

  return {
    ...session.content,
    questions: getQuestions(
      (session.content as AssessmentSessionContent).questions as any,
      questions,
      module.id,
      true
    ),
    start: session.start,
    maxTime: content.maxTime,
  };
}

export async function completeAssessment(
  module: AssessmentModule,
  s: ModuleSession
) {
  const session = s.content as AssessmentSessionContent;
  const answers = session.answers;

  var correctAnswers = 0;

  const questions = session.questions.map((qId) =>
    module.content.questions.find((q) => q._id.toString() == qId)
  );

  for (var i = 0; i < questions.length; i++) {
    var correct =
      answers[i]?.sort().toString() === questions[i]?.answers.sort().toString();
    if (correct) correctAnswers++;
  }

  const score = correctAnswers / session.questions.length;

  s.complete({ score });

  await s.save();

  return { score };
}

export async function startVideo(
  module: Module,
  session: ModuleSession,
  user: User
) {
  if (session) {
    session.restart();
    await session.save();
    return {};
  }

  await createSession({
    module: module.id,
    user: user.id,
    isCompleted: false,
    content: {},
    type: module.type,
  });

  return {};
}

export async function completeVideo(session: ModuleSession) {
  if (!session.isCompleted) {
    session.complete();
    await session.save();
  }
  return {};
}

export async function startPresentation(
  module: Module,
  session: ModuleSession,
  user: User
) {
  const content = module.content as PresentationModule["content"];

  const titles = content.slides.map((slide) => slide.title);

  const metadata = {
    slideLength: content.slides.length,
    titles,
  };

  if (session) {
    return {
      ...session.content,
      slides: content.slides,
      titles,
      slideLength: content.slides.length,
    };
  }

  await createSession<PresentationSessionContent>({
    user: user.id,
    content: {
      currentSlide: 0,
      answers: [],
    },
    module: module.id,
    isCompleted: false,
    type: module.type,
  });

  return {
    session: {
      currentSlide: 0,
      slides: content.slides,
      answers: [],
    },
    metadata,
  };
}

export async function completePresentation(
  module: Module,
  session: ModuleSession
) {
  const { slides } = module.content as PresentationModule["content"];
  const presentationSession = session.content as PresentationSessionContent;
  const userAnswers = presentationSession.answers;

  const questionsLength = slides.filter(
    (slide) => slide.type === SlideType.Question
  ).length;

  if (questionsLength === 0) {
    session.complete();
    await session.save();
    return {};
  }

  if (userAnswers.length !== questionsLength)
    throw new HttpError(400, "Answer All Questions First");

  const correctAnswers = userAnswers.filter(
    (a) => a.answer === a.correctAnswer
  ).length;

  const score = correctAnswers / questionsLength;

  session.complete({ score });

  await session.save();

  return { score };
}
