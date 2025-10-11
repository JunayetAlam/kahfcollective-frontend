/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle, Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { v4 as uuidv4 } from "uuid";
type QuesType = {
    title: string;
    description: string;
    type: "VIDEO" | "QUIZ";
    status: "DRAFT" | "PUBLISHED";
    courseId?: string | undefined;
    questionText?: string | undefined;
    videoFile?: any;
    questions?: {
        id: string;
        type: "MULTIPLE_CHOICE" | "WRITE_ANSWER";
        question: string;
        options: string[];
        correctAnswer: string;
    }[] | undefined;
}
type payloadType = {
    watch: UseFormWatch<QuesType>,
    setValue: UseFormSetValue<QuesType>,
    errors: FieldErrors<QuesType>,
    control: Control<QuesType, any, QuesType>
}
export default function MF_ManageQuiz({ watch, setValue, errors, control }: payloadType) {
    const addQuestion = () => {
        const questions = watch("questions") || [];
        setValue(
            "questions",
            [
                ...questions,
                {
                    id: uuidv4(),
                    question: "",
                    options: ["", "", "", ""],
                    correctAnswer: "",
                    type: 'MULTIPLE_CHOICE'
                },
            ],
            { shouldValidate: true },
        );
    };
    const removeQuestion = (index: number) => {
        const questions = watch("questions") || [];
        setValue(
            "questions",
            questions.filter((_, i) => i !== index),
            { shouldValidate: true },
        );
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" /> Quiz Questions
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Create multiple choice questions
                    </p>
                    <Button size="sm" onClick={addQuestion}>
                        <Plus className="mr-2 h-4 w-4" /> Add Question
                    </Button>
                </div>

                {(watch("questions") || []).map((question, qIndex) => (
                    <Card
                        key={question.id}
                        className="border-l-4 border-l-blue-500"
                    >
                        <CardHeader className="flex items-start justify-between pb-3">
                            <h4>Question {qIndex + 1}</h4>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeQuestion(qIndex)}
                            >
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="mt-2 flex flex-col gap-2">
                                <Label className="whitespace-nowrap">
                                    Quiz Type:
                                </Label>
                                <Select
                                    value={question.type}
                                    onValueChange={(value: "MULTIPLE_CHOICE" | "WRITE_ANSWER") => {
                                        const updated = [...(watch("questions") || [])];
                                        updated[qIndex].type = value;
                                        setValue("questions", updated, {
                                            shouldValidate: true,
                                        });
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Question Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                                        <SelectItem value="WRITE_ANSWER">Write Answer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='space-y-2'>
                                <Label className="whitespace-nowrap">
                                    Question:
                                </Label>
                                <Input
                                    placeholder="Enter question"
                                    value={question.question}
                                    onChange={(e) => {
                                        const updated = [...(watch("questions") || [])];
                                        updated[qIndex].question = e.target.value;
                                        setValue("questions", updated, {
                                            shouldValidate: true,
                                        });
                                    }}
                                />
                                {errors.questions?.[qIndex]?.question && (
                                    <p className="text-sm text-red-500">
                                        {errors.questions[qIndex]?.question?.message}
                                    </p>
                                )}
                            </div>
                            {question.type === 'MULTIPLE_CHOICE' && question.options.map((opt, oIndex) => (
                                <div
                                    key={oIndex}
                                    className="flex items-center gap-2"
                                >
                                    <Badge variant="outline">
                                        {String.fromCharCode(65 + oIndex)}
                                    </Badge>
                                    <Input
                                        className="flex-1"
                                        placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                        value={opt}
                                        onChange={(e) => {
                                            const updated = [
                                                ...(watch("questions") || []),
                                            ];
                                            updated[qIndex].options[oIndex] =
                                                e.target.value;
                                            setValue("questions", updated, {
                                                shouldValidate: true,
                                            });
                                        }}
                                    />
                                    {errors.questions?.[qIndex]?.options?.[
                                        oIndex
                                    ] && (
                                            <p className="text-sm text-red-500">
                                                {
                                                    errors.questions[qIndex]?.options?.[oIndex]
                                                        ?.message
                                                }
                                            </p>
                                        )}
                                </div>
                            ))}



                            {/* Correct Answer Selector */}
                            <div className="mt-2 flex flex-col gap-2">
                                <Label className="whitespace-nowrap">
                                    Correct Answer:
                                </Label>
                                {
                                    question.type === 'WRITE_ANSWER' ? <Input
                                        placeholder="Enter question"
                                        value={question.correctAnswer}
                                        onChange={(e) => {
                                            const updated = [...(watch("questions") || [])];
                                            updated[qIndex].correctAnswer = e.target.value;
                                            setValue("questions", updated, {
                                                shouldValidate: true,
                                            });
                                        }}
                                    /> : <Controller
                                        name={
                                            `questions.${qIndex}.correctAnswer` as const
                                        }
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value?.toString()}
                                                onValueChange={(val) =>
                                                    field.onChange(val)
                                                }
                                            >
                                                <SelectTrigger className="w-24">
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="A">A</SelectItem>
                                                    <SelectItem value="B">B</SelectItem>
                                                    <SelectItem value="C">C</SelectItem>
                                                    <SelectItem value="D">D</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                }
                                {errors.questions?.[qIndex]?.correctAnswer && (
                                    <p className="text-sm text-red-500">
                                        {
                                            errors.questions[qIndex]?.correctAnswer
                                                ?.message
                                        }
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {errors.questions &&
                    typeof errors.questions?.message === "string" && (
                        <p className="mt-2 text-sm text-red-500">
                            {errors.questions.message}
                        </p>
                    )}
            </CardContent>
        </Card>
    );
}