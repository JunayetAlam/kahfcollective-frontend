/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useGetAllQuizzesForCourseQuery } from "@/redux/api/courseContent";
import { CourseContents } from "@/types";
import { useGetQuizResultQuery } from "@/redux/api/ansQuizApi";
import QuizResults from "./QuizResult";
import QuizIntro from "./QuizIntro";
import QuizQuestion from "./QuizQuestion";
import { useAppSelector } from "@/redux/store";
import { useCurrentUser } from "@/redux/authSlice";

export interface QuizState {
  started: boolean;
  currentQuestionIndex: number;
  selectedAnswers: Record<number, string>;
  quizCompleted: boolean;
  submittedAnswers: Record<number, boolean>;
  /** 1 = forward / next, -1 = back / previous */
  direction: number;
}

const stageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
};

export default function Quiz({ contents }: { contents: CourseContents }) {
  const { data, isLoading } = useGetAllQuizzesForCourseQuery(contents.id);
  const user = useAppSelector(useCurrentUser);
  const {
    data: getQuizResult,
    isLoading: getQuizResultLoading,
    refetch: refetchQuizResult,
  } = useGetQuizResultQuery(contents.id, {
    skip: user?.role !== "USER",
  });

  const [quizState, setQuizState] = useState<QuizState>({
    started: false,
    currentQuestionIndex: 0,
    selectedAnswers: {},
    quizCompleted: false,
    submittedAnswers: {},
    direction: 1,
  });

  useEffect(() => {
    if (!data) return;

    const selectedAnswers: Record<number, string> = (
      data?.data || []
    ).reduce(
      (acc, item, index) => {
        const answer = ((item?.quizAnswers || [])[0] || {})?.answer;
        if (answer !== undefined) {
          acc[index] = answer;
        }
        return acc;
      },
      {} as Record<number, string>,
    );
    setQuizState((prev) => ({
      ...prev,
      selectedAnswers,
    }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const allQuizzes = data?.data || [];
  const totalQuestions = allQuizzes.length;
  const quizResult = getQuizResult?.data;

  const handleStartQuiz = () =>
    setQuizState((prev) => ({
      ...prev,
      started: true,
      currentQuestionIndex: 0,
      direction: 1,
    }));

  const handleSkipQuiz = () => {
    setQuizState({
      started: false,
      currentQuestionIndex: 0,
      selectedAnswers: {},
      quizCompleted: true,
      submittedAnswers: {},
      direction: 1,
    });
  };

  const handleRestartQuiz = () => {
    setQuizState({
      started: true,
      currentQuestionIndex: 0,
      selectedAnswers: {},
      quizCompleted: false,
      submittedAnswers: {},
      direction: 1,
    });
  };

  if (getQuizResultLoading) {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span>Loading assessment results…</span>
      </div>
    );
  }

  const stageKey = quizResult?.isAllAnswered
    ? quizState.started
      ? "review"
      : "results"
    : quizState.started
      ? "questions"
      : "intro";

  return (
    <div className="flex w-full flex-col items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stageKey}
          className="flex w-full flex-col items-center"
          {...stageTransition}
        >
          {quizResult?.isAllAnswered ? (
            !quizState.started ? (
              <QuizResults
                quizResult={quizResult}
                viewQuiz={handleRestartQuiz}
              />
            ) : (
              <QuizQuestion
                allQuizzes={allQuizzes}
                quizState={quizState}
                role={user?.role}
                setQuizState={setQuizState}
                refetchQuizResult={refetchQuizResult}
                isAllAnswered={quizResult?.isAllAnswered || false}
                isAllMarked={quizResult?.isAllMarked || false}
                result={{
                  correct: quizResult?.correct,
                  total: quizResult?.total,
                }}
              />
            )
          ) : !quizState.started ? (
            <QuizIntro
              contents={contents}
              role={user?.role}
              totalQuestions={totalQuestions}
              onSkip={handleSkipQuiz}
              onStart={handleStartQuiz}
            />
          ) : (
            <QuizQuestion
              allQuizzes={allQuizzes}
              quizState={quizState}
              setQuizState={setQuizState}
              role={user?.role}
              refetchQuizResult={refetchQuizResult}
              isAllAnswered={quizResult?.isAllAnswered || false}
              isAllMarked={quizResult?.isAllMarked || false}
              result={{
                correct: quizResult?.correct,
                total: quizResult?.total,
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
