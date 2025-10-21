/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

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
import {
  useCreateQuizContentMutation,
  useCreateFileContentMutation,
} from "@/redux/api/courseContent";
import { CourseContentData } from "@/types";
import { Plus, Upload, Video } from "lucide-react";
import MF_ManageQuiz from "./MF_ManageQuiz";
import { TiDocument } from "react-icons/ti";

// ------------------ Zod Schema ------------------
const contentSchema = z
  .object({
    courseId: z.string().optional(),
    title: z.string().min(1, "Title must be at least 1 characters"),
    description: z.string().min(2, "Description must be at least 2 characters"),
    questionText: z.string().optional(),
    type: z.enum(["VIDEO", "QUIZ", "PDF"]),
    status: z.enum(["DRAFT", "PUBLISHED"]),
    videoFile: z.any().optional(),
    pdfFile: z.any().optional(),
    questions: z
      .array(
        z.object({
          id: z.string(),
          type: z.enum(['MULTIPLE_CHOICE', 'WRITE_ANSWER']),
          question: z.string().min(1, "Question is required"),
          options: z
            .array(z.string()),
          correctAnswer: z.string(),
        }),
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (data.type === "VIDEO") return !!data.videoFile;
      if (data.type === "PDF") return !!data.pdfFile;
      if (data.type === "QUIZ") return !!data.questions?.length;
      return true;
    },
    {
      message:
        "Video is required for VIDEO, at least 1 question required for QUIZ, PDF is required for PDF",
      path: ["videoFile", "questions", "pdfFile"],
    },
  );

type ContentFormValues = z.infer<typeof contentSchema>;

// ------------------ Component ------------------
export function MF_ContentForm({
  isEdit = false,
  trigger = null,
  courseData,
}: any & { existingContent?: CourseContentData }) {
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
      pdfFile: null,
      questionText: "",
      questions: [],
    },
  });

  const watchedType = watch("type");

  const [createQuizContent, { isLoading: isContentQuizLoading }] =
    useCreateQuizContentMutation();
  const [createFileCourseContent, { isLoading: isVideoContentLoading }] =
    useCreateFileContentMutation();

  const isLoading =
    isContentQuizLoading || isVideoContentLoading;

  // ------------------ Submit Handler ------------------
  const onSubmit: SubmitHandler<ContentFormValues> = async (data) => {
    if (data.type === "VIDEO" || data.type === 'PDF') {
      if (data.type === 'VIDEO') if (!data.videoFile) return;
      if (data.type === 'PDF') if (!data.pdfFile) return;

      const formData = new FormData();
      formData.append("courseId", courseData.id);
      formData.append("type", data.type);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("status", data.status);
      if (data.type === 'VIDEO') {
        formData.append("file", data.videoFile);
      }
      if (data.type === 'PDF') {
        formData.append("file", data.pdfFile);
      }

      try {
        await createFileCourseContent(formData).unwrap();
        setOpen(false);
      } catch (err) {
        console.error("Error creating content:", err);
      }
    }

    if (data.type === "QUIZ") {
      if (!data.questions?.length) return;

      const formattedQuizzes = data.questions.map((q) => ({
        question: q.question,
        ...(q.options && {
          options: {
            A: q.options[0],
            B: q.options[1],
            C: q.options[2],
            D: q.options[3],
          },
        }),
        rightAnswer: q.correctAnswer,
        type: q.type,
      }));

      const payload = {
        courseId: data.courseId,
        type: data.type,
        title: data.title,
        description: data.description,
        status: data.status,
        quizzes: formattedQuizzes,
      };

      try {
        await createQuizContent(payload as any).unwrap();
        setOpen(false);
      } catch (err) {
        console.error("Error creating Assessment content:", err);
      }
    }
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
      <DialogContent className="overflow-auto ">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Content" : "Add New Content"}
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            {isEdit
              ? "Update content details"
              : "Create new video or Assessment content"}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="content">
                {watchedType === "VIDEO" && "Video"}
                {watchedType === "QUIZ" && "Assessment"}
                {watchedType === "PDF" && "PDF"}
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
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VIDEO">Video</SelectItem>
                            <SelectItem value="QUIZ">Assessment</SelectItem>
                            <SelectItem value="PDF">PDF</SelectItem>
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
                          value={field.value}
                          onValueChange={field.onChange}
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
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            id="video-upload-input"
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            }
                          />
                          <label htmlFor="video-upload-input">
                            <Button variant="outline" asChild>
                              <span>
                                <Upload className="mr-2 h-4 w-4" />
                                Choose Video File
                              </span>
                            </Button>
                          </label>
                          {field.value && (
                            <div className="mt-2 text-sm text-green-700">
                              ✓ {field.value.name} selected
                            </div>
                          )}
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
              {watchedType === "PDF" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TiDocument className="h-5 w-5" /> PDF Upload
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="overflow-y-auto">
                    <Controller
                      name="pdfFile"
                      control={control}
                      render={({ field }) => (
                        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                          <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-600">
                            Drag & drop or click to upload
                          </p>
                          <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            id="video-upload-input"
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            }
                          />
                          <label htmlFor="video-upload-input">
                            <Button variant="outline" asChild>
                              <span>
                                <Upload className="mr-2 h-4 w-4" />
                                Choose PDF File
                              </span>
                            </Button>
                          </label>
                          {field.value && (
                            <div className="mt-2 text-sm text-green-700">
                              ✓ {field.value.name} selected
                            </div>
                          )}
                          {errors.pdfFile && (
                            <p className="mt-2 text-sm text-red-500">
                              {errors.pdfFile.message?.toString()}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </CardContent>
                </Card>
              )}



              {watchedType === "QUIZ" && (
                <MF_ManageQuiz control={control} errors={errors} setValue={setValue} watch={watch} />
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-3 border-t py-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isEdit ? "Save Changes" : "Create Content"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
