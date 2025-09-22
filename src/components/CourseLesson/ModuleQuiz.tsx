/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Circle, Loader2 } from "lucide-react"
import { useGetAllQuizzesForCourseQuery } from "@/redux/api/courseContent"
import { CourseContents } from "@/types"
import { useAnswerQuizMutation, useGetQuizResultQuery, useLockQuizMutation } from "@/redux/api/ansQuizApi"
import { toast } from "sonner"

interface QuizState {
    started: boolean
    currentQuestionIndex: number
    selectedAnswers: Record<number, string>
    quizCompleted: boolean
    submittedAnswers: Record<number, boolean> // Track which questions have been submitted to API
}

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
}

export default function QuizPage({ contents }: { contents: CourseContents }) {
    const [answerQuiz,] = useAnswerQuizMutation()
    const [lockQuiz, { isLoading: lockQuizLoading }] = useLockQuizMutation()
    const { data, isLoading } = useGetAllQuizzesForCourseQuery(contents.id)
    const { data: getQuizResult, isLoading: getQuizResultLoading, refetch: refetchQuizResult } = useGetQuizResultQuery(contents.id)
    
    const [quizState, setQuizState] = useState<QuizState>({
        started: false,
        currentQuestionIndex: 0,
        selectedAnswers: {},
        quizCompleted: false,
        submittedAnswers: {},
    })

    const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false)

    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )

    const allQuizzes = data?.data || []
    const totalQuestions = allQuizzes.length
    const currentQuestion = allQuizzes[quizState.currentQuestionIndex]
    const answeredQuestionsCount = Object.keys(quizState.selectedAnswers).length

    const optionsArray = currentQuestion ? Object.values(currentQuestion.options) : []
    const quizResult: QuizResult | undefined = getQuizResult?.data

    const handleStartQuiz = () => setQuizState(prev => ({ ...prev, started: true }))
    
    const handleSkipQuiz = () => {
        setQuizState({ 
            started: false, 
            currentQuestionIndex: 0, 
            selectedAnswers: {}, 
            quizCompleted: true, 
            submittedAnswers: {} 
        })
    }
    
    const handleRestartQuiz = () => {
        setQuizState({ 
            started: false, 
            currentQuestionIndex: 0, 
            selectedAnswers: {}, 
            quizCompleted: false, 
            submittedAnswers: {} 
        })
    }
    
    const handleAnswerChange = (value: string) => {
        setQuizState(prev => ({ 
            ...prev, 
            selectedAnswers: { ...prev.selectedAnswers, [prev.currentQuestionIndex]: value } 
        }))
    }

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

        setIsSubmittingAnswer(true)
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
        } finally {
            setIsSubmittingAnswer(false)
        }
    }

    const lockQuizQuestions = async () => {
        try {
            await lockQuiz(contents.id).unwrap()
            toast.success("Quiz submitted successfully!")
            
            // Refetch quiz results to get the updated data with correct answers
            await refetchQuizResult()
            
            setQuizState(prev => ({ ...prev, started: false, quizCompleted: true }))
        } catch (error: any) {
            console.error('Error locking quiz:', error)
            const errorMessage = error?.data?.message || error?.message || "Failed to submit quiz. Please try again."
            toast.error(errorMessage)
            throw error
        }
    }

    const handleNext = async () => {
        const currentAnswer = quizState.selectedAnswers[quizState.currentQuestionIndex]
        const isAnswerSubmitted = quizState.submittedAnswers[quizState.currentQuestionIndex]
        
        // Submit answer if not already submitted
        if (currentAnswer && !isAnswerSubmitted) {
            const success = await submitAnswer(quizState.currentQuestionIndex, currentAnswer)
            if (!success) return // Don't proceed if submission failed
        }

        if (quizState.currentQuestionIndex < totalQuestions - 1) {
            setQuizState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }))
        } else {
            // This is the last question, lock the quiz
            try {
                await lockQuizQuestions()
            } catch  {
                // Error already handled in lockQuizQuestions
            }
        }
    }
    
    const handlePrevious = () => {
        if (quizState.currentQuestionIndex > 0) {
            setQuizState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 }))
        }
    }

    // Loading state for quiz results
    if (getQuizResultLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading quiz results...</span>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center">
            {quizState.quizCompleted ? (
                <Card className="w-full text-center max-w-2xl shadow-lg dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">Quiz Results</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">You have completed the quiz!</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {quizResult ? (
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
                                            <div key={answer.quizId} className={`p-3 rounded-lg border ${
                                                answer.isRight 
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
                        ) : (
                            <div className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                                Quiz completed but results are loading...
                            </div>
                        )}
                        
                        <Button 
                            size="lg" 
                            onClick={handleRestartQuiz} 
                            className="mt-6 w-full bg-gray-700 text-white hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700"
                        >
                            Take Quiz Again
                        </Button>
                    </CardContent>
                </Card>
            ) : !quizState.started ? (
                <Card className="w-full max-w-2xl py-20 text-center shadow-lg dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">Quiz</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">{contents.title}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Total Number Of Questions: {totalQuestions}</p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Total Marks: {totalQuestions}</p>
                        <div className="grid grid-cols-2 gap-5 w-full pt-6">
                            <Button 
                                size="lg" 
                                onClick={handleSkipQuiz} 
                                variant="outline" 
                                className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 bg-transparent"
                            >
                                Skip Quiz
                            </Button>
                            <Button 
                                size="lg" 
                                onClick={handleStartQuiz} 
                                className="w-full bg-gray-700 text-white hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700"
                            >
                                Start Quiz
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="w-full space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz</h2>
                        <div className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            {answeredQuestionsCount}/{totalQuestions} answered
                        </div>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Question {quizState.currentQuestionIndex + 1} of {totalQuestions}</div>
                    <Progress 
                        value={((quizState.currentQuestionIndex + 1) / totalQuestions) * 100} 
                        className="h-2 bg-gray-200 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-value]:bg-primary" 
                    />
                    <Card className="p-6 shadow-lg dark:bg-gray-800">
                        <CardContent className="space-y-6 p-0">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{currentQuestion?.question}</h3>
                            <RadioGroup 
                                value={quizState.selectedAnswers[quizState.currentQuestionIndex] || ""} 
                                onValueChange={handleAnswerChange} 
                                className="grid gap-4"
                                disabled={isSubmittingAnswer}
                            >
                                {optionsArray.map((option, index) => (
                                    <div
                                        key={index}
                                        onClick={() => !isSubmittingAnswer && handleAnswerChange(option)}
                                        className={`flex items-center space-x-3 rounded-md border p-4 transition-colors duration-200 ${
                                            isSubmittingAnswer ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                                        } ${
                                            quizState.selectedAnswers[quizState.currentQuestionIndex] === option
                                                ? "border-primary bg-primary/20 dark:border-primary dark:bg-primary/30"
                                                : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                                        }`}
                                    >
                                        <RadioGroupItem value={option} id={`option-${index}`} className="sr-only" />
                                        <Label 
                                            htmlFor={`option-${index}`} 
                                            className={`flex-1 text-base font-medium text-gray-800 dark:text-gray-200 ${
                                                isSubmittingAnswer ? 'cursor-not-allowed' : 'cursor-pointer'
                                            }`}
                                        >
                                            {option}
                                        </Label>
                                        <Circle className={`h-5 w-5 text-gray-400 dark:text-gray-500 ${quizState.selectedAnswers[quizState.currentQuestionIndex] === option && "fill-primary"}`} />
                                    </div>
                                ))}
                            </RadioGroup>
                            
                            {/* Show submission status */}
                            {quizState.submittedAnswers[quizState.currentQuestionIndex] && (
                                <div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                                    <p className="text-sm text-green-700 dark:text-green-400">✓ Answer submitted successfully</p>
                                </div>
                            )}
                            
                            <div className="mt-8 flex w-full gap-4 max-w-max ml-auto">
                                <Button 
                                    size="lg" 
                                    onClick={handlePrevious} 
                                    disabled={!quizState.started || quizState.currentQuestionIndex === 0 || isSubmittingAnswer || lockQuizLoading} 
                                    variant="outline"
                                >
                                    <ArrowLeft className="h-4 w-4" /> 
                                    Previous
                                </Button>
                                <Button 
                                    size="lg" 
                                    onClick={handleNext} 
                                    disabled={
                                        !quizState.started || 
                                        !quizState.selectedAnswers[quizState.currentQuestionIndex] || 
                                        isSubmittingAnswer || 
                                        lockQuizLoading
                                    } 
                                    variant="secondary"
                                >
                                    {(isSubmittingAnswer || lockQuizLoading) && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                    {quizState.currentQuestionIndex === totalQuestions - 1 ? "Submit Quiz" : "Next"} 
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}