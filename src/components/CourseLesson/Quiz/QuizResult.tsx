import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface QuizResultAnswer {
    quizId: string
    index: number
    answerId: string | null
    question: string
    userAnswer: string | null
    isRight: boolean
    isLocked: boolean
    correctAnswer?: string
}

interface QuizResult {
    total: number
    correct: number
    incorrect: number
    answers: QuizResultAnswer[]
    isAllMarked: boolean
}

interface QuizResultsProps {
    quizResult: QuizResult | undefined
    viewQuiz: () => void
}

export default function QuizResults({ quizResult, viewQuiz }: QuizResultsProps) {
    return (
        <Card className="w-full text-center max-w-2xl shadow-lg dark:bg-gray-800">
            <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">Assessment Results</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">You have completed the assessment!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {quizResult ? (
                    <>
                        {!quizResult.isAllMarked ? (
                            <>
                                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                    <div className="text-xl font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                                        Your answers are under review by the instructor
                                    </div>
                                    <div className="text-sm text-yellow-700 dark:text-yellow-400">
                                        Results will be available once the review is complete.
                                    </div>
                                </div>

                                {/* Show submitted answers */}
                                <div className="mt-6 space-y-3 text-left">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Submitted Answers:</h3>
                                    <div className="max-h-60 overflow-y-auto space-y-2">
                                        {quizResult.answers.map((answer, index) => (
                                            <div key={answer.quizId} className="p-3 rounded-lg border bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    Q{index + 1}: {answer.question}
                                                </div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                    Your answer: <span className="font-medium">{answer.userAnswer || 'Not answered'}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                                    Your Score: {quizResult.correct} / {quizResult.total}
                                </div>
                                <Progress
                                    value={(quizResult.correct / quizResult.total) * 100}
                                    className="h-4 bg-gray-200 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-value]:bg-green-500"
                                />
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <div className="text-green-600 dark:text-green-400 font-semibold">Correct</div>
                                        <div className="text-2xl font-bold text-green-700 dark:text-green-300">{quizResult.correct}</div>
                                    </div>
                                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <div className="text-red-600 dark:text-red-400 font-semibold">Incorrect</div>
                                        <div className="text-2xl font-bold text-red-700 dark:text-red-300">{quizResult.incorrect}</div>
                                    </div>
                                </div>

                                {/* Detailed Results */}
                                <div className="mt-6 space-y-3 text-left">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Question Details:</h3>
                                    <div className="max-h-60 overflow-y-auto space-y-2">
                                        {quizResult.answers.map((answer, index) => (
                                            <div key={answer.quizId} className={`p-3 rounded-lg border ${answer.isRight
                                                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                                                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                                                }`}>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    Q{index + 1}: {answer.question}
                                                </div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                    Your answer: <span className="font-medium">{answer.userAnswer || 'Not answered'}</span>
                                                    {answer.correctAnswer && (
                                                        <span className="ml-2">
                                                            | Correct: <span className="font-medium text-green-600 dark:text-green-400">{answer.correctAnswer}</span>
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
                    <div className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        Assessment completed but results are loading...
                    </div>
                )}
            </CardContent>
            <div className="px-7">
                <Button
                    size="lg"
                    onClick={viewQuiz}
                    className="mt-6 w-full bg-gray-700 text-white hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                    View All Assessment
                </Button>
            </div>
        </Card>
    )
}