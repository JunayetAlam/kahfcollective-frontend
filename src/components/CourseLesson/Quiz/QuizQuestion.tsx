/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { useAnswerQuizMutation, useGetSingleQuizAnswerQuery, useLockQuizMutation } from "@/redux/api/ansQuizApi"
import { toast } from "sonner"
import SingleQuiz from "./SingleQuiz"
import { Quiz } from "@/types"
interface QuizState {
    started: boolean
    currentQuestionIndex: number
    selectedAnswers: Record<number, string>
    quizCompleted: boolean
    submittedAnswers: Record<number, boolean>

}

interface QuizQuestionProps {
    allQuizzes: Quiz[]
    quizState: QuizState
    setQuizState: React.Dispatch<React.SetStateAction<QuizState>>
    refetchQuizResult: () => void
    isAllAnswered: boolean
    result?: {
        total?: number
        correct?: number
    }
}

export default function QuizQuestion({ allQuizzes, quizState, setQuizState, refetchQuizResult, isAllAnswered, result }: QuizQuestionProps) {
    const totalQuestions = allQuizzes.length
    const currentQuestion = allQuizzes[quizState.currentQuestionIndex]
    const [answerQuiz, { isLoading: answerQuizLoading }] = useAnswerQuizMutation()
    const [lockQuiz, { isLoading: lockQuizLoading }] = useLockQuizMutation()

    const { data, isLoading } = useGetSingleQuizAnswerQuery(currentQuestion.id)
    if (isLoading) {
        return ''
    }

    const answeredQuestionsCount = Object.keys(quizState.selectedAnswers).length
    const quizAns = data?.data;
    const submitAnswer = async (questionIndex: number, selectedAnswerText: string) => {
        const question = allQuizzes[questionIndex]
        if (!question) return false

        // Find the option key (A, B, C, D) for the selected answer text
        const optionKey = Object.keys(question.options).find(
            key => question.options[key as 'A' | 'B' | 'C' | 'D'] === selectedAnswerText
        )

        if (!optionKey) {
            toast.error("Invalid answer selection")
            return false
        }

        try {
            await answerQuiz({
                quizId: question.id,
                answer: optionKey // Send A, B, C, or D
            }).unwrap()

            setQuizState(prev => ({
                ...prev,
                submittedAnswers: { ...prev.submittedAnswers, [questionIndex]: true }
            }))

            toast.success("Answer submitted successfully!")
            return true
        } catch (error: any) {
            console.error('Error submitting answer:', error)
            const errorMessage = error?.data?.message || error?.message || "Failed to submit answer. Please try again."
            toast.error(errorMessage)
            return false
        }
    }

    const lockQuizQuestions = async () => {
        try {
            if (!isAllAnswered) {
                await lockQuiz(allQuizzes[0]?.courseContentId || "").unwrap()
                toast.success("Quiz submitted successfully!")

                // Refetch quiz results to get the updated data with correct answers
                refetchQuizResult()
            }

            setQuizState(prev => ({ ...prev, started: false, quizCompleted: true }))
        } catch (error: any) {
            console.error('Error locking quiz:', error)
            const errorMessage = error?.data?.message || error?.message || "Failed to submit quiz. Please try again."
            toast.error(errorMessage)
            throw error
        }
    }

    const handleAnswerChange = (value: string) => {
        setQuizState(prev => ({
            ...prev,
            selectedAnswers: { ...prev.selectedAnswers, [prev.currentQuestionIndex]: value }
        }))
    }

    const handleNext = async () => {
        const currentAnswer = quizState.selectedAnswers[quizState.currentQuestionIndex]

        // Submit answer if not already submitted
        if (!quizAns?.isLocked) {
            if (currentAnswer) {
                const success = await submitAnswer(quizState.currentQuestionIndex, currentAnswer)
                if (!success) return // Don't proceed if submission failed
            }

        }

        if (quizState.currentQuestionIndex < totalQuestions - 1) {
            setQuizState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }))
        } else {
            await lockQuizQuestions()
        }
    }

    const handlePrevious = () => {
        if (quizState.currentQuestionIndex > 0) {
            setQuizState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 }))
        }
    }
    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz</h2>
                <div className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {
                        isAllAnswered ? `${result?.total || 'N'}/${result?.correct || 'A'} Result` : `${answeredQuestionsCount}/${totalQuestions} answered`
                    }

                </div>
            </div>
            <div className="text-gray-600 dark:text-gray-400">Question {quizState.currentQuestionIndex + 1} of {totalQuestions}</div>
            <Progress
                value={((quizState.currentQuestionIndex + 1) / totalQuestions) * 100}
                className="h-2 bg-gray-200 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-value]:bg-primary"
            />
            <Card className="p-6 shadow-lg dark:bg-gray-800">
                <CardContent className="space-y-6 p-0">
                    <SingleQuiz
                        currentQuestion={currentQuestion}
                        selectedAnswer={quizState.selectedAnswers[quizState.currentQuestionIndex] || ""}
                        onAnswerChange={handleAnswerChange}
                        isSubmitted={quizState.submittedAnswers[quizState.currentQuestionIndex]}
                        isSubmitting={answerQuizLoading}
                        quizAns={quizAns}
                    />

                    <div className="mt-8 flex w-full gap-4 max-w-max ml-auto">
                        <Button
                            size="lg"
                            onClick={handlePrevious}
                            disabled={quizState.currentQuestionIndex === 0 || answerQuizLoading || lockQuizLoading}
                            variant="outline"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <Button
                            size="lg"
                            onClick={handleNext}
                            disabled={
                                quizAns?.isLocked ? false : (!quizState.selectedAnswers[quizState.currentQuestionIndex] ||
                                    answerQuizLoading ||
                                    lockQuizLoading)
                            }
                            variant="secondary"
                        >
                            {(answerQuizLoading || lockQuizLoading) && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            {quizState.currentQuestionIndex === totalQuestions - 1 ? isAllAnswered ? 'Done' : 'Submit Quiz' : "Next"}
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}