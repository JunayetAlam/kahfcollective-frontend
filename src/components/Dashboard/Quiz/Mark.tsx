"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { QuizAnswerGroup, QuizAnswerInstructor, QuizOptions } from "@/types";
import { useGetInstructorResultsQuery, useMarkQuizAnswerMutation } from "@/redux/api/ansQuizApi";
import Spinner from "@/components/Global/Spinner";
import { useState } from "react";

export default function Mark({ quizAnswer }: { quizAnswer: QuizAnswerGroup }) {
    const [fetchData, setFetchData] = useState(false);
    const { data, isLoading } = useGetInstructorResultsQuery(
        [{ name: 'contentId', value: quizAnswer.courseContentId }, { name: 'userId', value: quizAnswer.userId }],
        { skip: !fetchData }
    );

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button onClick={() => setFetchData(true)} variant="default">
                    Mark
                </Button>
            </DialogTrigger>

            <DialogContent className=" max-h-[80vh] overflow-y-auto">
                {isLoading ? (
                    <Spinner />
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex flex-col gap-2">
                                <span>Mark Questions</span>
                                <div className="flex gap-2">
                                    {!data?.data?.isAllAnswered && <Badge variant="outline">Still Answering</Badge>}

                                    <Badge >{data?.data?.markPercent}%</Badge>
                                </div>
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {data?.data?.answers?.map((answer, idx) => (
                                <SingleQuestion key={idx} answer={answer} isAllAnswered={data?.data?.isAllAnswered || false} />
                            ))}
                        </div>

                        {data?.data?.answers?.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No answers found
                            </div>
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

function SingleQuestion({ answer, isAllAnswered }: { answer: QuizAnswerInstructor, isAllAnswered: boolean }) {
    const [mark, { isLoading }] = useMarkQuizAnswerMutation()
    const renderWriteAnswer = (answer: QuizAnswerInstructor) => {
        return (
            <div className="space-y-3">
                <div className="space-y-2">
                    <div>
                        <span className="text-sm font-medium">User&apos;s Answer:</span>
                        <div className="mt-1 p-2 border rounded-md">
                            {answer.userAnswer || 'No answer provided'}
                        </div>
                    </div>
                    <div>
                        <span className="text-sm font-medium">Correct Answer:</span>
                        <div className="mt-1 p-2 border rounded-md">
                            {answer.correctAnswer}
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    const renderMultipleChoice = (answer: QuizAnswerInstructor) => {
        const userOption = answer.options[answer.userAnswer as keyof QuizOptions];
        const correctOption = answer.options[answer.correctAnswer as keyof QuizOptions];

        return (
            <div className="space-y-3">
                <div className="space-y-2">
                    <div>
                        <span className="text-sm font-medium">User&apos;s Answer:</span>
                        <div className="mt-1 p-2 border rounded-md">
                            <span className="font-medium">{answer.userAnswer}.</span> {userOption}
                        </div>
                    </div>
                    <div>
                        <span className="text-sm font-medium">Correct Answer:</span>
                        <div className="mt-1 p-2 border rounded-md">
                            <span className="font-medium">{answer.correctAnswer}.</span> {correctOption}
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    const handleMark = async (isCorrect: boolean) => {
        await mark({ isRight: isCorrect, quizAnswerId: answer.answerId }).unwrap()
    };
    
    return <Card key={answer.answerId}>
        <CardContent className="pt-6">
            <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">Question {answer.index}:</span>
                            <Badge variant="secondary">{answer.type.replace('_', ' ')}</Badge>
                        </div>
                        <p className="text-base">{answer.question}</p>
                    </div>
                </div>

                {
                    answer.isAnswered ? <>
                        <div className="pl-4 border-l-2">
                            {answer.type === 'MULTIPLE_CHOICE' && renderMultipleChoice(answer)}
                            {answer.type === 'WRITE_ANSWER' && renderWriteAnswer(answer)}
                        </div>


                    </> : <p>Not Answer Yet</p>
                }
                {
                    isAllAnswered && <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                            {typeof answer.isRight === 'boolean' && (
                                <Badge variant={answer.isRight ? "default" : "destructive"}>
                                    {answer.isRight ? 'Marked Correct' : 'Marked Incorrect'}
                                </Badge>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant={answer.isRight ? "default" : "outline"}
                                onClick={() => handleMark(true)}
                            >
                                <Check className="h-4 w-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant={!answer.isRight ? typeof answer.isRight === 'boolean' ? 'destructive' : 'outline' : "outline"}
                                onClick={() => handleMark(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                }
            </div>
        </CardContent>
    </Card>
}