"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useCreateVideoCourseContentMutation } from "@/redux/api/courseContent";
import { CourseContentData } from "@/types";
import { HelpCircle, Plus, Trash2, Upload, Video } from "lucide-react";

// ------------------ Zod Schema ------------------
const contentSchema = z
  .object({
    courseId: z.string().optional(),
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
    type: z.enum(["VIDEO", "QUIZ"]),
    status: z.enum(["DRAFT", "PUBLISHED"]),
    videoFile: z.any().optional(),
    questions: z
      .array(
        z.object({
          question: z.string().min(1, "Question is required"),
          options: z
            .array(z.string().min(1, "Option cannot be empty"))
            .length(4, "Exactly 4 options are required"),
          correctAnswer: z
            .number()
            .min(0, "Correct answer is required")
            .max(3, "Correct answer must be between 0 and 3"),
        }),
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (data.type === "VIDEO") return !!data.videoFile;
      if (data.type === "QUIZ") return !!data.questions?.length;
      return true;
    },
    {
      message:
        "Video is required for VIDEO, at least 1 question required for QUIZ",
      path: ["videoFile", "questions"],
    },
  );

type ContentFormValues = z.infer<typeof contentSchema>;

// ------------------ Component ------------------
export function MF_ContentForm({
  isEdit = false,
  trigger = null,
  existingContent,
  courseData,
}: any & {
  existingContent: CourseContentData;
}) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      courseId: courseData?.id as string,
      title: "",
      description: "",
      type: "VIDEO",
      status: "PUBLISHED",
      videoFile: null,
      questions: [],
    },
  });

  const watchedType = watch("type");

  const [createVideoCourse, { isLoading }] =
    useCreateVideoCourseContentMutation();

  const onSubmit: SubmitHandler<ContentFormValues> = async (data) => {
    if (data.type === "VIDEO") {
      if (!data.videoFile) return; // safety check

      const formData = new FormData();
      formData.append("courseId", courseData.id);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("status", data.status);
      formData.append("file", data.videoFile); // append actual file

      try {
        const res = await createVideoCourse(formData).unwrap();
        console.log("Video content created:", res);
      } catch (err) {
        console.error("Error creating video content:", err);
      }
    }

    if (data.type === "QUIZ") {
      // handle quiz submission separately if needed
    }

    setOpen(false);
  };

  // ------------------ Question Handling ------------------
  const addQuestion = () => {
    const questions = watch("questions") || [];
    setValue(
      "questions",
      [
        ...questions,
        { question: "", options: ["", "", "", ""], correctAnswer: 0 },
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const defaultTrigger = (
    <Button size="sm">
      <Plus className="mr-2 h-4 w-4" />
      Add Content
    </Button>
  );

  // ------------------ JSX ------------------
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="overflow-auto sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Content" : "Add New Content"}
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            {isEdit
              ? "Update content details"
              : "Create new video or quiz content"}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="content">
                {watchedType === "VIDEO" ? "Video" : "Quiz"}
              </TabsTrigger>
            </TabsList>

            {/* ------------------ Details Tab ------------------ */}
            <TabsContent value="details" className="mt-4 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" {...register("title")} />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VIDEO">Video</SelectItem>
                            <SelectItem value="QUIZ">Quiz</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DRAFT">Draft</SelectItem>
                            <SelectItem value="PUBLISHED">Published</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ------------------ Content Tab ------------------ */}
            <TabsContent value="content" className="mt-4 space-y-4">
              {watchedType === "VIDEO" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5" /> Video Upload
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="overflow-y-auto">
                    <Controller
                      name="videoFile"
                      control={control}
                      render={({ field }) => (
                        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                          <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-600">
                            Drag & drop or click to upload
                          </p>

                          {/* Hidden input */}
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            id="video-upload-input"
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            }
                          />

                          {/* Button triggers hidden input */}
                          <label htmlFor="video-upload-input">
                            <Button variant="outline" asChild>
                              <span>
                                <Upload className="mr-2 h-4 w-4" />
                                Choose Video File
                              </span>
                            </Button>
                          </label>

                          {/* Show selected file */}
                          {field.value && (
                            <div className="mt-2 text-sm text-green-700">
                              ✓ {field.value.name} selected
                            </div>
                          )}

                          {/* Error */}
                          {errors.videoFile && (
                            <p className="mt-2 text-sm text-red-500">
                              {errors.videoFile.message?.toString()}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </CardContent>
                </Card>
              )}

              {watchedType === "QUIZ" && (
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
                        key={question.question || qIndex}
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

                          {question.options.map((opt, oIndex) => (
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
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-3 border-t py-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Save Changes" : "Create Content"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
