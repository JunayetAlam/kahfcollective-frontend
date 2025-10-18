import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Circle } from "lucide-react"
import { Quiz, QuizAnswers, UserRoleEnum } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

interface SingleQuizProps {
    currentQuestion: Quiz
    selectedAnswer: string
    onAnswerChange: (value: string) => void
    isSubmitted: boolean
    isSubmitting: boolean
    quizAns: QuizAnswers | undefined
    isAllMarked?: boolean
    role: UserRoleEnum | undefined
}

export default function SingleQuiz({
    currentQuestion,
    selectedAnswer,
    onAnswerChange,
    isSubmitted,
    isSubmitting,
    quizAns,
    isAllMarked,
    role
}: SingleQuizProps) {
    const isWriteAnswer = currentQuestion.type === "WRITE_ANSWER"
    const isUser = role === 'USER'
    const correctAnswer = isUser ? selectedAnswer : currentQuestion.rightAnswer
    const optionsArray = !isWriteAnswer && currentQuestion.options
        ? Object.entries(currentQuestion.options).map(([key, value]) => ({
            name: key,
            value
        }))
        : []


    if (role !== 'USER') {
        console.log({ role, correctAnswer })
        return <>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {currentQuestion?.question}
                </h3>

            </div>

            {isWriteAnswer ? (
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Correct Answer:</Label>
                    <Textarea
                        value={correctAnswer}
                        disabled
                        className="border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-600"
                    />
                </div>
            ) : (
                <RadioGroup
                    value={correctAnswer}
                    className="grid gap-4"
                    disabled={true}
                >
                    {optionsArray.map((option, index) => {
                        const isSelected = correctAnswer === option.name
                        return (
                            <div
                                key={index}
                                className={`relative flex items-center space-x-3 rounded-md border p-4 transition-colors duration-200
                                            ${isSelected
                                        ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20"
                                        : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"}
                                        `}
                            >
                                <RadioGroupItem
                                    value={option.value}
                                    id={`option-${index}`}
                                    className="sr-only"
                                />
                                <Label
                                    htmlFor={`option-${index}`}
                                    className="flex-1 text-base font-medium text-gray-800 dark:text-gray-200"
                                >
                                    {option.value}
                                </Label>
                                {isSelected && isUser && (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200">
                                        Your Answer
                                    </Badge>
                                )}
                                <Circle
                                    className={`h-5 w-5 text-gray-400 dark:text-gray-500 
                                                ${isSelected ? "fill-blue-500" : ""}
                                            `}
                                />
                            </div>
                        )
                    })}
                </RadioGroup>
            )}
        </>
    }
    if (quizAns?.isLocked) {
        // If locked but not marked, show only submitted answer
        if (!isAllMarked) {
            return (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {currentQuestion?.question}
                        </h3>
                        {
                            isUser && <Badge
                                variant="secondary"
                                className="bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200"
                            >
                                Under Review
                            </Badge>
                        }
                    </div>

                    {isWriteAnswer ? (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">{isUser ? 'Your Submitted Answer' : 'Correct Answer'}:</Label>
                            <Textarea
                                value={quizAns.answer}
                                disabled
                                className="border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-600"
                            />
                        </div>
                    ) : (
                        <RadioGroup
                            value={quizAns.answer}
                            className="grid gap-4"
                            disabled={true}
                        >
                            {optionsArray.map((option, index) => {
                                const isSelected = quizAns?.answer === option.name
                                return (
                                    <div
                                        key={index}
                                        className={`relative flex items-center space-x-3 rounded-md border p-4 transition-colors duration-200
                                            ${isSelected
                                                ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20"
                                                : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"}
                                        `}
                                    >
                                        <RadioGroupItem
                                            value={option.value}
                                            id={`option-${index}`}
                                            className="sr-only"
                                        />
                                        <Label
                                            htmlFor={`option-${index}`}
                                            className="flex-1 text-base font-medium text-gray-800 dark:text-gray-200"
                                        >
                                            {option.value}
                                        </Label>
                                        {isSelected && isUser && (
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200">
                                                Your Answer
                                            </Badge>
                                        )}
                                        <Circle
                                            className={`h-5 w-5 text-gray-400 dark:text-gray-500 
                                                ${isSelected ? "fill-blue-500" : ""}
                                            `}
                                        />
                                    </div>
                                )
                            })}
                        </RadioGroup>
                    )}
                </>
            )
        }

        // If locked and marked, show results
        return (
            <>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {currentQuestion?.question}
                    </h3>
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

                {isWriteAnswer ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Your Answer:</Label>
                            <Textarea
                                value={quizAns.answer}
                                disabled
                                className={`${quizAns.isRight
                                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                    : "border-red-500 bg-red-50 dark:bg-red-900/20"
                                    }`}
                            />
                        </div>
                        {!quizAns.isRight && (
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Correct Answer:</Label>
                                <Textarea
                                    value={quizAns.rightAnswer || ''}
                                    disabled
                                    className="border-green-500 bg-green-50 dark:bg-green-900/20"
                                />
                            </div>
                        )}
                    </div>
                ) : (
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
                                        ${isCorrect && "border-primary bg-primary/20 dark:border-primary dark:bg-primary/30"}
                                        ${isWrong
                                            ? "border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-800"
                                            : "border-gray-200 dark:border-gray-700"}
                                    `}
                                >
                                    <RadioGroupItem
                                        value={option.value}
                                        id={`option-${index}`}
                                        className="sr-only"
                                    />
                                    <Label
                                        htmlFor={`option-${index}`}
                                        className="flex-1 text-base font-medium text-gray-800 dark:text-gray-200"
                                    >
                                        {option.value}
                                    </Label>
                                    {isCorrect && <Badge className="absolute right-0">Right Answer</Badge>}
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
                )}
            </>
        )
    }

    return (
        <>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {currentQuestion?.question}
            </h3>

            {isWriteAnswer ? (
                <div className="space-y-2">
                    <Label htmlFor="write-answer" className="text-sm font-medium">
                        Your Answer:
                    </Label>
                    <Textarea
                        id="write-answer"
                        value={correctAnswer}
                        onChange={(e) => onAnswerChange(e.target.value)}
                        placeholder="Type your answer here..."
                        disabled={isSubmitting}
                        className="w-full"
                    />
                </div>
            ) : (
                <RadioGroup
                    value={correctAnswer}
                    // onValueChange={onAnswerChange}
                    className="grid gap-4"
                    disabled={isSubmitting}
                >
                    {optionsArray.map((option, index) => (
                        <div
                            key={index}
                            onClick={() => !isSubmitting && onAnswerChange(option.name)}
                            className={`flex items-center space-x-3 rounded-md border p-4 transition-colors duration-200 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                                } ${correctAnswer === option.name
                                    ? "border-primary bg-primary/20 dark:border-primary dark:bg-primary/30"
                                    : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                                }`}
                        >
                            <RadioGroupItem
                                value={option.name}
                                id={`option-${index}`}
                                className="sr-only"
                            />
                            <Label
                                htmlFor={`option-${index}`}
                                className={`flex-1 text-base font-medium text-gray-800 dark:text-gray-200 ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'
                                    }`}
                            >
                                {option.value}
                            </Label>
                            <Circle
                                className={`h-5 w-5 text-gray-400 dark:text-gray-500 ${correctAnswer === option.name && "fill-primary"
                                    }`}
                            />
                        </div>
                    ))}
                </RadioGroup>
            )}

            {/* Show submission status */}
            {isSubmitted && (
                <div className="mt-4 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                    <p className="text-sm text-green-700 dark:text-green-400">
                        ✓ Answer submitted successfully
                    </p>
                </div>
            )}
        </>
    )
}