"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useGetAllQuizzesForCourseQuery } from "@/redux/api/courseContent"
import { CourseContents } from "@/types"
import { useGetQuizResultQuery } from "@/redux/api/ansQuizApi"
import QuizResults from "./QuizResult"
import QuizIntro from "./QuizIntro"
import QuizQuestion from "./QuizQuestion"

interface QuizState {
    started: boolean
    currentQuestionIndex: number
    selectedAnswers: Record<number, string>
    quizCompleted: boolean
    submittedAnswers: Record<number, boolean>
}

export default function Quiz({ contents }: { contents: CourseContents }) {
    const { data, isLoading } = useGetAllQuizzesForCourseQuery(contents.id)
    const { data: getQuizResult, isLoading: getQuizResultLoading, refetch: refetchQuizResult } = useGetQuizResultQuery(contents.id)

    const [quizState, setQuizState] = useState<QuizState>({
        started: false,
        currentQuestionIndex: 0,
        selectedAnswers: {},
        quizCompleted: false,
        submittedAnswers: {},
    })

    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )

    const allQuizzes = data?.data || []
    const totalQuestions = allQuizzes.length
    const quizResult = getQuizResult?.data

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
            started: true,
            currentQuestionIndex: 0,
            selectedAnswers: {},
            quizCompleted: false,
            submittedAnswers: {}
        })
    }

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
            {quizResult?.isAllAnswered ? (
                !quizState.started ? <QuizResults
                    quizResult={quizResult}
                    viewQuiz={handleRestartQuiz}
                /> : <QuizQuestion
                    allQuizzes={allQuizzes}
                    quizState={quizState}
                    setQuizState={setQuizState}
                    refetchQuizResult={refetchQuizResult}
                    isAllAnswered={quizResult?.isAllAnswered || false}
                      result={{ correct: quizResult?.total, total: quizResult?.correct }}
                />
            ) : !quizState.started ? (
                <QuizIntro
                    contents={contents}
                    totalQuestions={totalQuestions}
                    onSkip={handleSkipQuiz}
                    onStart={handleStartQuiz}
                />
            ) : (
                <QuizQuestion
                    allQuizzes={allQuizzes}
                    quizState={quizState}
                    setQuizState={setQuizState}
                    refetchQuizResult={refetchQuizResult}
                    isAllAnswered={quizResult?.isAllAnswered || false}
                    result={{ correct: quizResult?.correct, total: quizResult?.total }}
                />
            )}
        </div>
    )
}