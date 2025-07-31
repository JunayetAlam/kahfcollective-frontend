"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Circle } from "lucide-react"

// Define the question type and quiz data
type Question = {
    question: string
    options: string[]
    correctAnswer: string // This can be used for scoring later, though not implemented in this example
}

const quizQuestions: Question[] = [
    {
        question: "What does 'Tawheed al-Asma wa's-Sifat' refer to?",
        options: [
            "The oneness of Allah's worship",
            "The oneness of Allah's names and attributes",
            "The oneness of Allah's Lordship",
            "The oneness of Allah's worship (duplicate for visual match)",
        ],
        correctAnswer: "The oneness of Allah's names and attributes",
    },
    {
        question: "Which pillar of Islam is fasting during Ramadan?",
        options: ["First", "Second", "Third", "Fourth"],
        correctAnswer: "Fourth",
    },
    {
        question: "What is the name of the holy book of Islam?",
        options: ["Torah", "Bible", "Quran", "Gospel"],
        correctAnswer: "Quran",
    },
    {
        question: "How many daily prayers (Salat) are obligatory in Islam?",
        options: ["Three", "Four", "Five", "Six"],
        correctAnswer: "Five",
    },
    {
        question: "What is the pilgrimage to Mecca called?",
        options: ["Jihad", "Zakat", "Hajj", "Salat"],
        correctAnswer: "Hajj",
    },
    {
        question: "Who is considered the last prophet in Islam?",
        options: ["Prophet Musa (Moses)", "Prophet Isa (Jesus)", "Prophet Ibrahim (Abraham)", "Prophet Muhammad"],
        correctAnswer: "Prophet Muhammad",
    },
    {
        question: "What is the Arabic term for charity given to the poor?",
        options: ["Salat", "Sawm", "Zakat", "Shahada"],
        correctAnswer: "Zakat",
    },
    {
        question: "What is the Islamic declaration of faith?",
        options: ["Salat", "Shahada", "Zakat", "Sawm"],
        correctAnswer: "Shahada",
    },
    {
        question: "What is the month of fasting in Islam?",
        options: ["Shawwal", "Muharram", "Ramadan", "Dhul-Hijjah"],
        correctAnswer: "Ramadan",
    },
    {
        question: "What is the direction Muslims face during prayer?",
        options: ["East", "West", "North", "Kaaba in Mecca"],
        correctAnswer: "Kaaba in Mecca",
    },
]

interface QuizState {
    started: boolean
    currentQuestionIndex: number
    quizCompleted: boolean
    score: number
    selectedAnswers: { [key: number]: string } // Map of question index to selected option
}

export default function QuizPage() {
    const [quizState, setQuizState] = useState<QuizState>({
        started: false,
        currentQuestionIndex: 0,
        selectedAnswers: {},
        quizCompleted: false,
        score: 0,
    })
    const totalQuestions = quizQuestions.length
    const currentQuestion = quizQuestions[quizState.currentQuestionIndex]
    const answeredQuestionsCount = Object.keys(quizState.selectedAnswers).length

    const calculateScore = () => {
        let correctCount = 0
        for (const index in quizState.selectedAnswers) {
            const questionIndex = Number.parseInt(index)
            if (quizQuestions[questionIndex].correctAnswer === quizState.selectedAnswers[questionIndex]) {
                correctCount++
            }
        }
        return correctCount
    }

    const handleStartQuiz = () => {
        setQuizState((prevState) => ({ ...prevState, started: true }))
    }

    const handleSkipQuiz = () => {
        setQuizState((prevState) => ({
            ...prevState,
            started: false,
            quizCompleted: true,
            score: 0, // Score is 0 if skipped
        }))
    }

    const handleRestartQuiz = () => {
        setQuizState({
            started: false,
            currentQuestionIndex: 0,
            selectedAnswers: {},
            quizCompleted: false,
            score: 0,
        })
    }

    const handleAnswerChange = (value: string) => {
        setQuizState((prevState) => ({
            ...prevState,
            selectedAnswers: {
                ...prevState.selectedAnswers,
                [prevState.currentQuestionIndex]: value,
            },
        }))
    }

    const handleNext = () => {
        if (quizState.currentQuestionIndex < totalQuestions - 1) {
            setQuizState((prevState) => ({
                ...prevState,
                currentQuestionIndex: prevState.currentQuestionIndex + 1,
            }))
        } else {
            // Last question, calculate score and complete quiz
            const finalScore = calculateScore()
            setQuizState((prevState) => ({
                ...prevState,
                started: false, // Exit quiz in progress view
                quizCompleted: true,
                score: finalScore,
            }))
        }
    }

    const handlePrevious = () => {
        if (quizState.currentQuestionIndex > 0) {
            setQuizState((prevState) => ({
                ...prevState,
                currentQuestionIndex: prevState.currentQuestionIndex - 1,
            }))
        }
    }

    return (
        <div className="flex flex-col items-center justify-center">
            {quizState.quizCompleted ? (
                // Results Screen
                <Card className="w-full text-center max-w-2xl shadow-lg dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">Quiz Results</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">You have completed the quiz!</CardDescription>
                    </CardHeader>
                    <CardContent className="spacmae-y-6">
                        <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                            Your Score: {quizState.score} / {totalQuestions}
                        </p>
                        <Progress
                            value={(quizState.score / totalQuestions) * 100}
                            className="h-4 bg-gray-200 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-value]:bg-green-500"
                        />
                        <Button
                            size={"lg"}
                            onClick={handleRestartQuiz}
                            className="mt-6 w-full bg-gray-700 text-white hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700"
                        >
                            Restart Quiz
                        </Button>
                    </CardContent>
                </Card>
            ) : !quizState.started ? (
                // Start Quiz Screen
                <Card className="w-full max-w-2xl py-20 text-center shadow-lg dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">Quiz 1</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            Test your understanding of Tawheed al-Asma wa&rsquo;s-Sifat
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            Total Number Of Questions: {totalQuestions}
                        </p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Total Marks: {totalQuestions}</p>
                        <div className="grid grid-cols-2 gap-5 w-full pt-6">
                            <Button
                                size={"lg"}
                                onClick={handleSkipQuiz}
                                variant="outline"
                                className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 bg-transparent"
                            >
                                Skip Quiz
                            </Button>
                            <Button
                                size={"lg"}
                                onClick={handleStartQuiz}
                                className="w-full bg-gray-700 text-white hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700"
                            >
                                Start Quiz
                            </Button>

                        </div>
                    </CardContent>
                </Card>
            ) : (
                // Quiz in Progress Screen
                <div className="w-full space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz 1</h2>
                        <div className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            {answeredQuestionsCount}/{totalQuestions} answered
                        </div>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                        Question {quizState.currentQuestionIndex + 1} of {totalQuestions}
                    </div>
                    <Progress
                        value={((quizState.currentQuestionIndex + 1) / totalQuestions) * 100}
                        className="h-2 bg-gray-200 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-value]:bg-primary"
                    />
                    <Card className="p-6 shadow-lg dark:bg-gray-800">
                        <CardContent className="space-y-6 p-0">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{currentQuestion.question}</h3>
                            <RadioGroup
                                value={quizState.selectedAnswers[quizState.currentQuestionIndex] || ""}
                                onValueChange={handleAnswerChange}
                                className="grid gap-4"
                            >
                                {currentQuestion.options.map((option, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleAnswerChange(option)}
                                        className={`flex items-center space-x-3 rounded-md border p-4 transition-colors duration-200 cursor-pointer ${quizState.selectedAnswers[quizState.currentQuestionIndex] === option
                                            ? "border-primary bg-primary/20 dark:border-primary dark:bg-primary/30"
                                            : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        <RadioGroupItem value={option} id={`option-${index}`} className="sr-only" />
                                        <Label
                                            htmlFor={`option-${index}`}
                                            className="flex-1 text-base font-medium cursor-pointer text-gray-800 dark:text-gray-200"
                                        >
                                            {option}
                                        </Label>
                                        <Circle className={`h-5 w-5 text-gray-400 dark:text-gray-500 ${quizState.selectedAnswers[quizState.currentQuestionIndex] === option && 'fill-primary'}`} /> {/* Icon for visual match */}
                                    </div>
                                ))}
                            </RadioGroup>
                            <div className="mt-8 flex w-full gap-4 max-w-max ml-auto">
                                <Button
                                    size={"lg"}
                                    onClick={handlePrevious}
                                    disabled={!quizState.started || quizState.currentQuestionIndex === 0}
                                    variant={"outline"}
                                >
                                    <ArrowLeft />
                                    Previous
                                </Button>
                                <Button
                                    size={"lg"}
                                    onClick={handleNext}
                                    disabled={!quizState.started || !quizState.selectedAnswers[quizState.currentQuestionIndex]}
                                    variant={"secondary"}
                                >
                                    {quizState.currentQuestionIndex === totalQuestions - 1 ? "Submit" : "Next"}
                                    <ArrowRight />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
