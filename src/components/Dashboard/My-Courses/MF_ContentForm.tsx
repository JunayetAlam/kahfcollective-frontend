/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

import RichTextEditor from "@/components/Forms/RichTextEditor";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateFileContentMutation,
  useCreateQuizContentMutation,
  useCreateTextOrLinkContentMutation,
} from "@/redux/api/courseContent";
import { CourseContentData } from "@/types";
import { Link2, Plus, Upload, Video } from "lucide-react";
import { toast } from "sonner";
import { TiDocument } from "react-icons/ti";
import MF_ManageQuiz from "./MF_ManageQuiz";

const contentTypes = [
  "VIDEO",
  "QUIZ",
  "PDF",
  "TEXT",
  "VIDEO_LINK",
  "MEETING_LINK",
] as const;

const contentSchema = z
  .object({
    courseId: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(2, "Description must be at least 2 characters"),
    questionText: z.string().optional(),
    type: z.enum(contentTypes),
    status: z.enum(["DRAFT", "PUBLISHED"]),
    videoFile: z.any().optional(),
    pdfFile: z.any().optional(),
    text: z.string().optional(),
    videoLink: z.string().optional(),
    meetingLink: z.string().optional(),
    questions: z
      .array(
        z.object({
          id: z.string(),
          type: z.enum(["MULTIPLE_CHOICE", "WRITE_ANSWER"]),
          question: z.string().min(1, "Question is required"),
          options: z.array(z.string()),
          correctAnswer: z.string(),
        }),
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "VIDEO" && !data.videoFile) {
      ctx.addIssue({
        code: "custom",
        message: "Video file is required",
        path: ["videoFile"],
      });
    }
    if (data.type === "PDF" && !data.pdfFile) {
      ctx.addIssue({
        code: "custom",
        message: "PDF file is required",
        path: ["pdfFile"],
      });
    }
    if (data.type === "QUIZ" && !data.questions?.length) {
      ctx.addIssue({
        code: "custom",
        message: "Add at least one question",
        path: ["questions"],
      });
    }
    if (data.type === "TEXT") {
      const plain = (data.text || "").replace(/<[^>]*>/g, "").trim();
      if (!plain) {
        ctx.addIssue({
          code: "custom",
          message: "Text content is required",
          path: ["text"],
        });
      }
    }
    if (data.type === "VIDEO_LINK") {
      try {
        if (!data.videoLink) throw new Error();
        new URL(data.videoLink);
      } catch {
        ctx.addIssue({
          code: "custom",
          message: "Enter a valid video URL",
          path: ["videoLink"],
        });
      }
    }
    if (data.type === "MEETING_LINK") {
      try {
        if (!data.meetingLink) throw new Error();
        new URL(data.meetingLink);
      } catch {
        ctx.addIssue({
          code: "custom",
          message: "Enter a valid meeting URL",
          path: ["meetingLink"],
        });
      }
    }
  });

type ContentFormValues = z.infer<typeof contentSchema>;

const defaultFormValues = (courseId?: string): ContentFormValues => ({
  courseId,
  title: "",
  description: "",
  type: "VIDEO",
  status: "PUBLISHED",
  videoFile: null,
  pdfFile: null,
  text: "",
  videoLink: "",
  meetingLink: "",
  questionText: "",
  questions: [],
});

export function MF_ContentForm({
  isEdit = false,
  trigger = null,
  courseData,
  semesterId,
  chapterId,
  scopeLabel,
}: any & {
  existingContent?: CourseContentData;
  semesterId?: string | null;
  chapterId?: string | null;
  scopeLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: defaultFormValues(courseData?.id),
  });

  const watchedType = watch("type");

  const [createQuizContent, { isLoading: isQuizLoading }] =
    useCreateQuizContentMutation();
  const [createFileCourseContent, { isLoading: isFileLoading }] =
    useCreateFileContentMutation();
  const [createTextOrLinkContent, { isLoading: isTextLinkLoading }] =
    useCreateTextOrLinkContentMutation();

  const isLoading = isQuizLoading || isFileLoading || isTextLinkLoading;

  const resetForm = () => reset(defaultFormValues(courseData?.id));

  const onSubmit: SubmitHandler<ContentFormValues> = async (data) => {
    const scopeFields = {
      ...(semesterId ? { semesterId } : {}),
      ...(chapterId ? { chapterId } : {}),
    };

    try {
      if (data.type === "VIDEO" || data.type === "PDF") {
        const formData = new FormData();
        formData.append("courseId", courseData.id);
        formData.append("type", data.type);
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("status", data.status);
        if (semesterId) formData.append("semesterId", semesterId);
        if (chapterId) formData.append("chapterId", chapterId);
        formData.append(
          "file",
          data.type === "VIDEO" ? data.videoFile : data.pdfFile,
        );
        await createFileCourseContent(formData).unwrap();
      } else if (data.type === "QUIZ") {
        const formattedQuizzes = (data.questions || []).map((q) => ({
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
        await createQuizContent({
          courseId: data.courseId || courseData.id,
          title: data.title,
          description: data.description,
          status: data.status,
          quizzes: formattedQuizzes,
          ...scopeFields,
        } as any).unwrap();
      } else {
        await createTextOrLinkContent({
          courseId: data.courseId || courseData.id,
          type: data.type,
          title: data.title,
          description: data.description,
          status: data.status,
          ...(data.type === "TEXT" ? { text: data.text } : {}),
          ...(data.type === "VIDEO_LINK" ? { videoLink: data.videoLink } : {}),
          ...(data.type === "MEETING_LINK"
            ? { meetingLink: data.meetingLink }
            : {}),
          ...scopeFields,
        }).unwrap();
      }

      toast.success("Content created successfully");
      resetForm();
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create content");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
      e.preventDefault();
    }
  };

  const defaultTrigger = (
    <Button size="sm">
      <Plus className="mr-2 h-4 w-4" />
      Add Content
    </Button>
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Content" : "Add New Content"}
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            {isEdit
              ? "Update content details"
              : scopeLabel
                ? `Create under ${scopeLabel}`
                : "Fill in the details below"}
          </p>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={handleKeyDown}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Content title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Short description"
              {...register("description")}
              rows={3}
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
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIDEO">Video</SelectItem>
                      <SelectItem value="QUIZ">Assessment</SelectItem>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="TEXT">Text</SelectItem>
                      <SelectItem value="VIDEO_LINK">Video Link</SelectItem>
                      <SelectItem value="MEETING_LINK">Meeting Link</SelectItem>
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
                  <Select value={field.value} onValueChange={field.onChange}>
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

          {watchedType === "VIDEO" && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Video file
              </Label>
              <Controller
                name="videoFile"
                control={control}
                render={({ field }) => (
                  <div className="rounded-md border border-dashed p-6 text-center">
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      id="video-upload-input"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                    <label htmlFor="video-upload-input">
                      <Button variant="outline" asChild type="button">
                        <span>
                          <Upload className="mr-2 h-4 w-4" />
                          Choose Video File
                        </span>
                      </Button>
                    </label>
                    {field.value && (
                      <p className="mt-3 text-sm text-green-700">
                        {field.value.name}
                      </p>
                    )}
                    {errors.videoFile && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.videoFile.message?.toString()}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          )}

          {watchedType === "PDF" && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <TiDocument className="h-4 w-4" />
                PDF file
              </Label>
              <Controller
                name="pdfFile"
                control={control}
                render={({ field }) => (
                  <div className="rounded-md border border-dashed p-6 text-center">
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      id="pdf-upload-input"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                    <label htmlFor="pdf-upload-input">
                      <Button variant="outline" asChild type="button">
                        <span>
                          <Upload className="mr-2 h-4 w-4" />
                          Choose PDF File
                        </span>
                      </Button>
                    </label>
                    {field.value && (
                      <p className="mt-3 text-sm text-green-700">
                        {field.value.name}
                      </p>
                    )}
                    {errors.pdfFile && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.pdfFile.message?.toString()}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          )}

          {watchedType === "TEXT" && (
            <div className="min-w-0 max-w-full space-y-2 overflow-hidden">
              <Controller
                name="text"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    name="text"
                    label="Text content"
                    required
                    content={field.value || ""}
                    onChangeHandler={field.onChange}
                    height="220px"
                  />
                )}
              />
              {errors.text && (
                <p className="text-sm text-red-500">{errors.text.message}</p>
              )}
            </div>
          )}

          {watchedType === "VIDEO_LINK" && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2" htmlFor="videoLink">
                <Link2 className="h-4 w-4" />
                Video URL
              </Label>
              <Input
                id="videoLink"
                type="url"
                placeholder="https://..."
                {...register("videoLink")}
              />
              {errors.videoLink && (
                <p className="text-sm text-red-500">
                  {errors.videoLink.message}
                </p>
              )}
            </div>
          )}

          {watchedType === "MEETING_LINK" && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2" htmlFor="meetingLink">
                <Link2 className="h-4 w-4" />
                Meeting URL
              </Label>
              <Input
                id="meetingLink"
                type="url"
                placeholder="https://..."
                {...register("meetingLink")}
              />
              {errors.meetingLink && (
                <p className="text-sm text-red-500">
                  {errors.meetingLink.message}
                </p>
              )}
            </div>
          )}

          {watchedType === "QUIZ" && (
            <div className="space-y-2 border-t pt-4">
              <MF_ManageQuiz
                control={control}
                errors={errors}
                setValue={setValue}
                watch={watch}
              />
              {errors.questions && (
                <p className="text-sm text-red-500">
                  {errors.questions.message?.toString() ||
                    "Add at least one question"}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
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
