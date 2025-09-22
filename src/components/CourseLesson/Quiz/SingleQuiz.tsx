import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Circle } from "lucide-react"
import { Quiz, QuizAnswers } from "@/types"
import { Badge } from "@/components/ui/badge"

interface SingleQuizProps {
    currentQuestion: Quiz
    selectedAnswer: string
    onAnswerChange: (value: string) => void
    isSubmitted: boolean
    isSubmitting: boolean
    quizAns: QuizAnswers | undefined
}

export default function SingleQuiz({
    currentQuestion,
    selectedAnswer,
    onAnswerChange,
    isSubmitted,
    isSubmitting,
    quizAns
}: SingleQuizProps) {
    const optionsArray = Object.entries(currentQuestion.options).map(
        ([key, value]) => ({
            name: key,
            value
        })
    );
    if (quizAns?.isLocked) {
        return <>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{currentQuestion?.question}</h3>
                <>
                    {quizAns.isRight && (
                        <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                        >
                            Right
                        </Badge>
                    )}
                    {!quizAns.isRight && (
                        <Badge
                            variant="secondary"
                            className="bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                        >
                            Wrong
                        </Badge>
                    )}
                </>
            </div>
            <RadioGroup
                value={quizAns.answer}
                className="grid gap-4"
                disabled={quizAns.isLocked || isSubmitting}
            >
                {optionsArray.map((option, index) => {
                    const isSelected = quizAns?.answer === option.name
                    const isCorrect = option.name === quizAns?.rightAnswer
                    const isWrong = isSelected && !isCorrect

                    return (
                        <div
                            key={index}
                            className={`relative flex items-center space-x-3 rounded-md border p-4 transition-colors duration-200
          ${isCorrect
                                && "border-primary bg-primary/20 dark:border-primary dark:bg-primary/30"

                                }
                                ${isWrong
                                    ? "border-red-200 bg-red-50  dark:border-red-700 dark:bg-red-800 "
                                    : "border-gray-200  dark:border-gray-700 "}
                                `}
                        >
                            <RadioGroupItem
                                value={option.value}
                                id={`option-${index}`}
                                className="sr-only"
                            />
                            <Label
                                htmlFor={`option-${index}`}
                                className={`flex-1 text-base font-medium text-gray-800 dark:text-gray-200`}
                            >
                                {option.value} 
                            </Label>
                            {isCorrect && <Badge  className="absolute right-0">Right Answer</Badge>}
                            <Circle
                                className={`h-5 w-5 text-gray-400 dark:text-gray-500 
            ${isSelected && isCorrect ? "fill-primary" : ""}
            ${isWrong ? "fill-red-400" : ""}
          `}
                            />
                        </div>
                    )
                })}
            </RadioGroup>
        </>
    }
    return (
        <>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{currentQuestion?.question}</h3>
            <RadioGroup
                value={selectedAnswer}
                onValueChange={onAnswerChange}
                className="grid gap-4"
                disabled={isSubmitting}
            >
                {optionsArray.map((option, index) => (
                    <div
                        key={index}
                        onClick={() => !isSubmitting && onAnswerChange(option.value)}
                        className={`flex items-center space-x-3 rounded-md border p-4 transition-colors duration-200 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                            } ${selectedAnswer === option.value
                                ? "border-primary bg-primary/20 dark:border-primary dark:bg-primary/30"
                                : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                            }`}
                    >
                        <RadioGroupItem value={option.value} id={`option-${index}`} className="sr-only" />
                        <Label
                            htmlFor={`option-${index}`}
                            className={`flex-1 text-base font-medium text-gray-800 dark:text-gray-200 ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'
                                }`}
                        >
                            {option.value}
                        </Label>
                        <Circle className={`h-5 w-5 text-gray-400 dark:text-gray-500 ${selectedAnswer === option.value && "fill-primary"}`} />
                    </div>
                ))}
            </RadioGroup>

            {/* Show submission status */}
            {isSubmitted && (
                <div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                    <p className="text-sm text-green-700 dark:text-green-400">✓ Answer submitted successfully</p>
                </div>
            )}
        </>
    )
}