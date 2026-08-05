import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface QuizResultAnswer {
  quizId: string;
  index: number;
  answerId: string | null;
  question: string;
  userAnswer: string | null;
  isRight: boolean;
  isLocked: boolean;
  correctAnswer?: string;
}

interface QuizResult {
  total: number;
  correct: number;
  incorrect: number;
  answers: QuizResultAnswer[];
  isAllMarked: boolean;
}

interface QuizResultsProps {
  quizResult: QuizResult | undefined;
  viewQuiz: () => void;
}

export default function QuizResults({ quizResult, viewQuiz }: QuizResultsProps) {
  const scorePercent =
    quizResult && quizResult.total > 0
      ? (quizResult.correct / quizResult.total) * 100
      : 0;

  return (
    <Card className="mx-auto w-full max-w-2xl border-border/70 text-center shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Assessment Results
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          You have completed the assessment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {quizResult ? (
          <>
            {!quizResult.isAllMarked ? (
              <>
                <div className="rounded-lg border border-amber-200/80 bg-amber-50 px-4 py-4 text-left dark:border-amber-800/60 dark:bg-amber-950/30">
                  <div className="text-base font-semibold text-amber-900 dark:text-amber-200">
                    Your answers are under review
                  </div>
                  <div className="mt-1 text-sm text-amber-800/90 dark:text-amber-300/90">
                    Results will be available once the instructor finishes marking.
                  </div>
                </div>

                <div className="mt-2 space-y-3 text-left">
                  <h3 className="text-sm font-semibold text-foreground">
                    Your submitted answers
                  </h3>
                  <div className="max-h-60 space-y-2 overflow-y-auto">
                    {quizResult.answers.map((answer, index) => (
                      <div
                        key={answer.quizId}
                        className="rounded-lg border border-border/60 bg-secondary/15 p-3"
                      >
                        <div className="text-sm font-medium text-foreground">
                          Q{index + 1}: {answer.question}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Your answer:{" "}
                          <span className="font-medium text-foreground">
                            {answer.userAnswer || "Not answered"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="text-2xl font-semibold text-foreground">
                    Your score: {quizResult.correct} / {quizResult.total}
                  </div>
                  <div className="relative mx-auto h-2 max-w-md overflow-hidden rounded-full bg-secondary/50">
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${scorePercent}%` }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <Progress value={scorePercent} className="sr-only" />
                </div>
                <div className="mx-auto grid max-w-md grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-emerald-200/70 bg-emerald-50 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                    <div className="font-medium text-emerald-700 dark:text-emerald-300">
                      Correct
                    </div>
                    <div className="mt-1 text-2xl font-bold text-emerald-800 dark:text-emerald-200">
                      {quizResult.correct}
                    </div>
                  </div>
                  <div className="rounded-lg border border-red-200/70 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/30">
                    <div className="font-medium text-red-700 dark:text-red-300">
                      Incorrect
                    </div>
                    <div className="mt-1 text-2xl font-bold text-red-800 dark:text-red-200">
                      {quizResult.incorrect}
                    </div>
                  </div>
                </div>

                <div className="mt-2 space-y-3 text-left">
                  <h3 className="text-sm font-semibold text-foreground">
                    Question details
                  </h3>
                  <div className="max-h-60 space-y-2 overflow-y-auto">
                    {quizResult.answers.map((answer, index) => (
                      <div
                        key={answer.quizId}
                        className={`rounded-lg border p-3 ${
                          answer.isRight
                            ? "border-emerald-200/80 bg-emerald-50/80 dark:border-emerald-900/50 dark:bg-emerald-950/25"
                            : "border-red-200/80 bg-red-50/80 dark:border-red-900/50 dark:bg-red-950/25"
                        }`}
                      >
                        <div className="text-sm font-medium text-foreground">
                          Q{index + 1}: {answer.question}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Your answer:{" "}
                          <span className="font-medium text-foreground">
                            {answer.userAnswer || "Not answered"}
                          </span>
                          {answer.correctAnswer && (
                            <span className="ml-2">
                              | Correct:{" "}
                              <span className="font-medium text-emerald-700 dark:text-emerald-400">
                                {answer.correctAnswer}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="text-lg font-medium text-muted-foreground">
            Assessment completed but results are loading…
          </div>
        )}
      </CardContent>
      <div className="px-6 pb-6">
        <Button size="lg" onClick={viewQuiz} className="mt-2 w-full">
          View All Assessment
        </Button>
      </div>
    </Card>
  );
}
