/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardList, Plus, Trash2 } from "lucide-react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

type QuesType = {
  title: string;
  description: string;
  type: "VIDEO" | "QUIZ" | "PDF" | "TEXT" | "VIDEO_LINK" | "MEETING_LINK";
  status: "DRAFT" | "PUBLISHED";
  courseId?: string | undefined;
  questionText?: string | undefined;
  videoFile?: any;
  pdfFile?: any;
  text?: string;
  videoLink?: string;
  meetingLink?: string;
  questions?:
    | {
        id: string;
        type: "MULTIPLE_CHOICE" | "WRITE_ANSWER";
        question: string;
        options: string[];
        correctAnswer: string;
      }[]
    | undefined;
};

type PayloadType = {
  watch: UseFormWatch<QuesType>;
  setValue: UseFormSetValue<QuesType>;
  errors: FieldErrors<QuesType>;
  control: Control<QuesType, any, QuesType>;
};

export default function MF_ManageQuiz({
  watch,
  setValue,
  errors,
  control,
}: PayloadType) {
  const questions = watch("questions") || [];

  const addQuestion = () => {
    setValue(
      "questions",
      [
        ...questions,
        {
          id: uuidv4(),
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          type: "MULTIPLE_CHOICE",
        },
      ],
      { shouldValidate: true },
    );
  };

  const removeQuestion = (index: number) => {
    setValue(
      "questions",
      questions.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  const updateQuestion = (
    index: number,
    patch: Partial<(typeof questions)[number]>,
  ) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...patch };
    setValue("questions", updated, { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
            <ClipboardList className="text-muted-foreground h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">Assessment questions</p>
              {questions.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {questions.length}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Build multiple-choice or written-answer questions below.
            </p>
          </div>
        </div>
        <Button type="button" size="sm" onClick={addQuestion}>
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </div>

      {questions.length === 0 && (
        <div className="bg-muted/40 rounded-lg border border-dashed px-4 py-10 text-center">
          <ClipboardList className="text-muted-foreground mx-auto mb-2 h-8 w-8 opacity-50" />
          <p className="text-sm font-medium">No questions yet</p>
          <p className="text-muted-foreground mt-1 text-xs">
            Click Add to create your first question.
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="mt-4"
            onClick={addQuestion}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add question
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {questions.map((question, qIndex) => (
          <div
            key={question.id}
            className="bg-background space-y-4 rounded-lg border p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold">
                  {qIndex + 1}
                </span>
                <p className="text-sm font-medium">Question {qIndex + 1}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive h-8 w-8"
                onClick={() => removeQuestion(qIndex)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Question type</Label>
                <Select
                  value={question.type}
                  onValueChange={(value: "MULTIPLE_CHOICE" | "WRITE_ANSWER") =>
                    updateQuestion(qIndex, { type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MULTIPLE_CHOICE">
                      Multiple choice
                    </SelectItem>
                    <SelectItem value="WRITE_ANSWER">Write answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {question.type === "MULTIPLE_CHOICE" && (
                <div className="space-y-1.5">
                  <Label className="text-xs">Correct option</Label>
                  <Controller
                    name={`questions.${qIndex}.correctAnswer` as const}
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString()}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select A–D" />
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
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Question text</Label>
              <Textarea
                placeholder="Enter your question…"
                rows={2}
                value={question.question}
                onChange={(e) =>
                  updateQuestion(qIndex, { question: e.target.value })
                }
              />
              {errors.questions?.[qIndex]?.question && (
                <p className="text-sm text-red-500">
                  {errors.questions[qIndex]?.question?.message}
                </p>
              )}
            </div>

            {question.type === "MULTIPLE_CHOICE" && (
              <div className="space-y-1.5">
                <Label className="text-xs">Options</Label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {question.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <span className="bg-muted text-muted-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-semibold">
                        {String.fromCharCode(65 + oIndex)}
                      </span>
                      <Input
                        placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                        value={opt}
                        onChange={(e) => {
                          const nextOptions = [...question.options];
                          nextOptions[oIndex] = e.target.value;
                          updateQuestion(qIndex, { options: nextOptions });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {question.type === "WRITE_ANSWER" && (
              <div className="space-y-1.5">
                <Label className="text-xs">Expected answer</Label>
                <Textarea
                  placeholder="Enter the correct answer…"
                  rows={2}
                  value={question.correctAnswer}
                  onChange={(e) =>
                    updateQuestion(qIndex, { correctAnswer: e.target.value })
                  }
                />
              </div>
            )}

            {errors.questions?.[qIndex]?.correctAnswer && (
              <p className="text-sm text-red-500">
                {errors.questions[qIndex]?.correctAnswer?.message}
              </p>
            )}
          </div>
        ))}
      </div>

      {questions.length > 0 && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={addQuestion}
        >
          <Plus className="mr-1 h-4 w-4" />
          Add another question
        </Button>
      )}
    </div>
  );
}
