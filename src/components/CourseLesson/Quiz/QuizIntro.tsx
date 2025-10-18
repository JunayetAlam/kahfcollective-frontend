import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CourseContents, UserRoleEnum } from "@/types"

interface QuizIntroProps {
    contents: CourseContents
    totalQuestions: number
    onSkip: () => void
    onStart: () => void
    role: UserRoleEnum | undefined
}

export default function QuizIntro({ contents, totalQuestions, onSkip, onStart, role }: QuizIntroProps) {
    return (
        <Card className="w-full max-w-xl py-10 text-center shadow-lg dark:bg-gray-800">
            <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">Assessment</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">{contents.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Total Number Of Questions: {totalQuestions}</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Total Marks: {totalQuestions}</p>
                <div className="grid grid-cols-2 gap-5 w-full pt-6">
                    {
                        role === 'USER' && <Button
                            size="lg"
                            onClick={onSkip}
                            variant="outline"
                            className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 bg-transparent"
                        >
                            Skip Assessment
                        </Button>
                    }
                    <div
                    className={`${role !=='USER' ? 'col-span-2' : 'col-span-1'}`}
                     >
                        <Button
                            size="lg"
                            onClick={onStart}
                            className="w-full bg-gray-700 text-white hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700"
                        >
                            {role === 'USER' ? ' Start Assessment' : 'See Question'}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}