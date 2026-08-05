/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Loading from "@/components/Global/Loading";
import {
  useAnswerQuizMutation,
  useGetSingleQuizAnswerQuery,
  useLockQuizMutation,
} from "@/redux/api/ansQuizApi";
import { Quiz, UserRoleEnum } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { QuizState } from "./Quiz";
import SingleQuiz from "./SingleQuiz";

interface QuizQuestionProps {
  allQuizzes: Quiz[];
  quizState: QuizState;
  setQuizState: React.Dispatch<React.SetStateAction<QuizState>>;
  refetchQuizResult: () => void;
  isAllAnswered: boolean;
  isAllMarked: boolean;
  result?: {
    total?: number;
    correct?: number;
  };
  role: UserRoleEnum | undefined;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction >= 0 ? 48 : -48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction >= 0 ? -48 : 48,
    opacity: 0,
  }),
};

export default function QuizQuestion({
  allQuizzes,
  quizState,
  setQuizState,
  refetchQuizResult,
  isAllAnswered,
  isAllMarked,
  result,
  role,
}: QuizQuestionProps) {
  const totalQuestions = allQuizzes.length;
  const currentQuestion = allQuizzes[quizState.currentQuestionIndex];
  const [answerQuiz, { isLoading: answerQuizLoading }] =
    useAnswerQuizMutation();
  const [lockQuiz, { isLoading: lockQuizLoading }] = useLockQuizMutation();

  const { data, isLoading } = useGetSingleQuizAnswerQuery(
    currentQuestion?.id,
    {
      skip: role !== "USER",
    },
  );

  if (isLoading) {
    return <Loading />;
  }

  const answeredQuestionsCount = Object.keys(quizState.selectedAnswers).length;
  const quizAns = data?.data;
  const progressPercent =
    ((quizState.currentQuestionIndex + 1) / Math.max(totalQuestions, 1)) * 100;

  const submitAnswer = async (
    questionIndex: number,
    selectedAnswerText: string,
  ) => {
    const question = allQuizzes[questionIndex];
    if (!question) return false;
    try {
      await answerQuiz({
        quizId: question.id,
        answer: selectedAnswerText,
      }).unwrap();

      setQuizState((prev) => ({
        ...prev,
        submittedAnswers: {
          ...prev.submittedAnswers,
          [questionIndex]: true,
        },
      }));

      toast.success("Answer submitted successfully!");
      return true;
    } catch (error: any) {
      console.error("Error submitting answer:", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to submit answer. Please try again.";
      toast.error(errorMessage);
      return false;
    }
  };

  const lockQuizQuestions = async () => {
    try {
      if (!isAllAnswered && role === "USER") {
        await lockQuiz(allQuizzes[0]?.courseContentId || "").unwrap();
        toast.success("Assessment submitted successfully!");
        refetchQuizResult();
      }

      setQuizState((prev) => ({
        ...prev,
        started: false,
        quizCompleted: true,
        direction: 1,
      }));
    } catch (error: any) {
      console.error("Error locking Assessment:", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to submit Assessment. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleAnswerChange = (value: string) => {
    setQuizState((prev) => ({
      ...prev,
      selectedAnswers: {
        ...prev.selectedAnswers,
        [prev.currentQuestionIndex]: value,
      },
    }));
  };

  const handleNext = async () => {
    const currentAnswer =
      quizState.selectedAnswers[quizState.currentQuestionIndex];

    if (!quizAns?.isLocked && role === "USER") {
      if (currentAnswer) {
        const success = await submitAnswer(
          quizState.currentQuestionIndex,
          currentAnswer,
        );
        if (!success) return;
      }
    }

    if (quizState.currentQuestionIndex < totalQuestions - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        direction: 1,
      }));
    } else {
      await lockQuizQuestions();
    }
  };

  const handlePrevious = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
        direction: -1,
      }));
    }
  };

  const statusLabel = isAllAnswered
    ? isAllMarked
      ? `${result?.correct || 0}/${result?.total || totalQuestions} Correct`
      : `${totalQuestions}/${totalQuestions} Submitted`
    : `${answeredQuestionsCount}/${totalQuestions} answered`;

  return (
    <div className="w-full space-y-5">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-muted-foreground">
            Question {quizState.currentQuestionIndex + 1} of {totalQuestions}
          </p>
          <span className="rounded-full bg-secondary/40 px-3 py-1 text-xs font-medium text-foreground">
            {statusLabel}
          </span>
        </div>
        <div className="relative h-1.5 overflow-hidden rounded-full bg-secondary/50">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-primary"
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <Progress value={progressPercent} className="sr-only" />
      </div>

      <div className="relative min-h-[280px] overflow-hidden rounded-xl border border-border/70 bg-background">
        <AnimatePresence mode="wait" custom={quizState.direction} initial={false}>
          <motion.div
            key={quizState.currentQuestionIndex}
            custom={quizState.direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="p-5 sm:p-6"
          >
            <SingleQuiz
              currentQuestion={currentQuestion}
              selectedAnswer={
                quizState.selectedAnswers[quizState.currentQuestionIndex] || ""
              }
              onAnswerChange={handleAnswerChange}
              isSubmitted={
                quizState.submittedAnswers[quizState.currentQuestionIndex]
              }
              isSubmitting={answerQuizLoading}
              quizAns={quizAns}
              isAllMarked={isAllMarked}
              role={role}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="ml-auto flex w-full max-w-max gap-3">
        <Button
          size="lg"
          onClick={handlePrevious}
          disabled={
            role !== "USER"
              ? false
              : quizState.currentQuestionIndex === 0 ||
                answerQuizLoading ||
                lockQuizLoading
          }
          variant="outline"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          size="lg"
          onClick={handleNext}
          disabled={
            role !== "USER"
              ? false
              : quizAns?.isLocked
                ? false
                : !quizState.selectedAnswers[quizState.currentQuestionIndex] ||
                  answerQuizLoading ||
                  lockQuizLoading
          }
          variant="secondary"
        >
          {(answerQuizLoading || lockQuizLoading) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {quizState.currentQuestionIndex === totalQuestions - 1
            ? isAllAnswered || role !== "USER"
              ? "Done"
              : "Submit Assessment"
            : "Next"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
