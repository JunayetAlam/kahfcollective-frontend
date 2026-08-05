/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import RichTextEditor from "@/components/Forms/RichTextEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  useAddSingleQuizMutation,
  useDeleteSingleQuizMutation,
  useGetAllQuizzesForCourseAdminQuery,
  useUpdateCourseContentMutation,
  useUpdateFileContentMutation,
  useUpdateSingleQuizMutation,
} from "@/redux/api/courseContent";
import { CourseContents } from "@/types";
import { ClipboardList, Link2, Plus, Trash2, Upload, Video } from "lucide-react";
import { TiDocument } from "react-icons/ti";

const contentTypes = [
  "VIDEO",
  "QUIZ",
  "PDF",
  "TEXT",
  "VIDEO_LINK",
  "MEETING_LINK",
] as const;

const editSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    status: z.enum(["DRAFT", "PUBLISHED"]),
    type: z.enum(contentTypes),
    text: z.string().optional(),
    videoLink: z.string().optional(),
    meetingLink: z.string().optional(),
    videoFile: z.any().optional(),
    pdfFile: z.any().optional(),
  })
  .superRefine((data, ctx) => {
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

type EditFormValues = z.infer<typeof editSchema>;

export default function EditContentForm({
  item,
  onClose,
}: {
  item: CourseContents;
  onClose: () => void;
}) {
  const [updateContent, { isLoading: isUpdating }] =
    useUpdateCourseContentMutation();
  const [updateFile, { isLoading: isUploading }] =
    useUpdateFileContentMutation();
  const [updateQuiz, { isLoading: isUpdatingQuiz }] =
    useUpdateSingleQuizMutation();
  const [deleteQuiz, { isLoading: isDeletingQuiz }] =
    useDeleteSingleQuizMutation();
  const [addQuiz, { isLoading: isAddingQuiz }] = useAddSingleQuizMutation();
  const { data: quizzesData, refetch } = useGetAllQuizzesForCourseAdminQuery(
    item?.id,
    { skip: item.type !== "QUIZ" },
  );

  const [quizToDelete, setQuizToDelete] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any>({});
  const [newQuiz, setNewQuiz] = useState<{
    question: string;
    options: { A: string; B: string; C: string; D: string } | null;
    rightAnswer: string;
    type: "MULTIPLE_CHOICE" | "WRITE_ANSWER";
  }>({
    question: "",
    options: { A: "", B: "", C: "", D: "" },
    rightAnswer: "A",
    type: "MULTIPLE_CHOICE",
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: item.title,
      description: item.description,
      status: item.status,
      type: item.type as EditFormValues["type"],
      text: item.text || "",
      videoLink: item.videoLink || "",
      meetingLink: item.meetingLink || "",
      videoFile: null,
      pdfFile: null,
    },
  });

  const watchedType = watch("type");
  const isSaving = isUpdating || isUploading;

  const onSubmit = async (data: EditFormValues) => {
    try {
      if (
        (data.type === "VIDEO" || data.type === "PDF") &&
        data.type !== item.type
      ) {
        const file = data.type === "VIDEO" ? data.videoFile : data.pdfFile;
        if (!file) {
          toast.error(
            `Please upload a ${data.type === "VIDEO" ? "video" : "PDF"} file when changing type`,
          );
          return;
        }
      }

      const payload: Record<string, unknown> = {
        title: data.title,
        description: data.description,
        status: data.status,
        type: data.type,
      };

      if (data.type === "TEXT") payload.text = data.text;
      if (data.type === "VIDEO_LINK") payload.videoLink = data.videoLink;
      if (data.type === "MEETING_LINK") payload.meetingLink = data.meetingLink;

      await updateContent({ id: item.id, data: payload }).unwrap();

      const file =
        data.type === "VIDEO"
          ? data.videoFile
          : data.type === "PDF"
            ? data.pdfFile
            : null;

      if (file && (data.type === "VIDEO" || data.type === "PDF")) {
        const formData = new FormData();
        formData.append("file", file);
        await updateFile({ id: item.id, formData }).unwrap();
      }

      toast.success("Content updated successfully");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleQuizUpdate = async (quiz: any) => {
    try {
      await updateQuiz({
        id: quiz.id,
        data: {
          question: quiz.question,
          ...(quiz.type === "MULTIPLE_CHOICE" && { options: quiz.options }),
          rightAnswer: quiz.rightAnswer,
          type: quiz.type,
        },
      }).unwrap();
      toast.success("Assessment updated");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update Assessment");
    }
  };

  const confirmDeleteQuiz = async () => {
    if (!quizToDelete) return;
    try {
      await deleteQuiz(quizToDelete.id).unwrap();
      toast.success("Assessment deleted");
      refetch();
      setQuizToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete Assessment");
    }
  };

  const handleAddQuiz = async () => {
    if (!newQuiz.question.trim()) {
      toast.error("Question is required");
      return;
    }
    try {
      const payload: any = {
        courseContentId: item.id,
        question: newQuiz.question,
        rightAnswer: newQuiz.rightAnswer,
        type: newQuiz.type,
      };
      if (newQuiz.type === "MULTIPLE_CHOICE" && newQuiz.options) {
        payload.options = newQuiz.options;
      }
      await addQuiz(payload).unwrap();
      toast.success("Assessment added");
      setNewQuiz({
        question: "",
        options: { A: "", B: "", C: "", D: "" },
        rightAnswer: "A",
        type: "MULTIPLE_CHOICE",
      });
      setShowAddDialog(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add Assessment");
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            (e.target as HTMLElement).tagName !== "TEXTAREA"
          ) {
            e.preventDefault();
          }
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="edit-title">Title</Label>
          <Input
            id="edit-title"
            placeholder="Title"
            {...register("title")}
            disabled={isSaving}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-description">Description</Label>
          <Textarea
            id="edit-description"
            placeholder="Description"
            rows={3}
            {...register("description")}
            disabled={isSaving}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
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
                  disabled={isSaving}
                >
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
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSaving}
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

        {watchedType === "VIDEO" && (
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Video file
              {item.type === "VIDEO" && item.videoUrl && (
                <span className="text-muted-foreground font-normal">
                  (optional — leave empty to keep current)
                </span>
              )}
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
                    id="edit-video-upload"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                  <label htmlFor="edit-video-upload">
                    <Button variant="outline" asChild type="button">
                      <span>
                        <Upload className="mr-2 h-4 w-4" />
                        {item.type === "VIDEO" ? "Replace Video" : "Choose Video"}
                      </span>
                    </Button>
                  </label>
                  {field.value && (
                    <p className="mt-3 text-sm text-green-700">
                      {field.value.name}
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
              {item.type === "PDF" && item.pdfUrl && (
                <span className="text-muted-foreground font-normal">
                  (optional — leave empty to keep current)
                </span>
              )}
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
                    id="edit-pdf-upload"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                  <label htmlFor="edit-pdf-upload">
                    <Button variant="outline" asChild type="button">
                      <span>
                        <Upload className="mr-2 h-4 w-4" />
                        {item.type === "PDF" ? "Replace PDF" : "Choose PDF"}
                      </span>
                    </Button>
                  </label>
                  {field.value && (
                    <p className="mt-3 text-sm text-green-700">
                      {field.value.name}
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
            <Label className="flex items-center gap-2" htmlFor="edit-videoLink">
              <Link2 className="h-4 w-4" />
              Video URL
            </Label>
            <Input
              id="edit-videoLink"
              type="url"
              placeholder="https://..."
              {...register("videoLink")}
              disabled={isSaving}
            />
            {errors.videoLink && (
              <p className="text-sm text-red-500">{errors.videoLink.message}</p>
            )}
          </div>
        )}

        {watchedType === "MEETING_LINK" && (
          <div className="space-y-2">
            <Label
              className="flex items-center gap-2"
              htmlFor="edit-meetingLink"
            >
              <Link2 className="h-4 w-4" />
              Meeting URL
            </Label>
            <Input
              id="edit-meetingLink"
              type="url"
              placeholder="https://..."
              {...register("meetingLink")}
              disabled={isSaving}
            />
            {errors.meetingLink && (
              <p className="text-sm text-red-500">
                {errors.meetingLink.message}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      {/* Quiz management when content is (or stays) QUIZ — show if original or selected type is QUIZ after save they'd refetch; for in-session editing show if watchedType is QUIZ and item was QUIZ (quizzes exist) OR always when QUIZ */}
      {watchedType === "QUIZ" && item.type === "QUIZ" && (
        <div className="space-y-4 border-t pt-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
                <ClipboardList className="text-muted-foreground h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">Assessment questions</h3>
                  {!!quizzesData?.data?.length && (
                    <Badge variant="secondary" className="text-xs">
                      {quizzesData.data.length}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  Edit existing questions or add new ones.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              type="button"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>

          {quizzesData?.data?.length ? (
            <div className="space-y-3">
              {quizzesData.data.map((quiz: any, qIndex: number) => {
                const current = editingQuiz[quiz.id] || quiz;
                return (
                  <div
                    key={quiz.id}
                    className="bg-background space-y-4 rounded-lg border p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold">
                        {qIndex + 1}
                      </span>
                      <p className="text-sm font-medium">
                        Question {qIndex + 1}
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Question type</Label>
                        <Select
                          value={current.type || "MULTIPLE_CHOICE"}
                          onValueChange={(
                            value: "MULTIPLE_CHOICE" | "WRITE_ANSWER",
                          ) =>
                            setEditingQuiz({
                              ...editingQuiz,
                              [quiz.id]: { ...current, type: value },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MULTIPLE_CHOICE">
                              Multiple choice
                            </SelectItem>
                            <SelectItem value="WRITE_ANSWER">
                              Write answer
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {current.type === "MULTIPLE_CHOICE" && (
                        <div className="space-y-1.5">
                          <Label className="text-xs">Correct option</Label>
                          <Select
                            value={current.rightAnswer}
                            onValueChange={(val) =>
                              setEditingQuiz({
                                ...editingQuiz,
                                [quiz.id]: { ...current, rightAnswer: val },
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {["A", "B", "C", "D"].map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Question text</Label>
                      <Textarea
                        rows={2}
                        value={current.question}
                        onChange={(e) =>
                          setEditingQuiz({
                            ...editingQuiz,
                            [quiz.id]: {
                              ...current,
                              question: e.target.value,
                            },
                          })
                        }
                      />
                    </div>

                    {current.type === "MULTIPLE_CHOICE" && current.options && (
                      <div className="space-y-1.5">
                        <Label className="text-xs">Options</Label>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {Object.entries(current.options).map(
                            ([key, value]: any) => (
                              <div
                                key={key}
                                className="flex items-center gap-2"
                              >
                                <span className="bg-muted text-muted-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-semibold">
                                  {key}
                                </span>
                                <Input
                                  value={value}
                                  onChange={(e) =>
                                    setEditingQuiz({
                                      ...editingQuiz,
                                      [quiz.id]: {
                                        ...current,
                                        options: {
                                          ...current.options,
                                          [key]: e.target.value,
                                        },
                                      },
                                    })
                                  }
                                />
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {current.type === "WRITE_ANSWER" && (
                      <div className="space-y-1.5">
                        <Label className="text-xs">Expected answer</Label>
                        <Textarea
                          rows={2}
                          value={current.rightAnswer}
                          onChange={(e) =>
                            setEditingQuiz({
                              ...editingQuiz,
                              [quiz.id]: {
                                ...current,
                                rightAnswer: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-2 border-t pt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setQuizToDelete(quiz)}
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        Delete
                      </Button>
                      <Button
                        size="sm"
                        type="button"
                        onClick={() => handleQuizUpdate(current)}
                        disabled={isUpdatingQuiz}
                      >
                        Save question
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-muted/40 rounded-lg border border-dashed px-4 py-8 text-center">
              <p className="text-sm font-medium">No questions yet</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Add your first assessment question.
              </p>
            </div>
          )}
        </div>
      )}

      {watchedType === "QUIZ" && item.type !== "QUIZ" && (
        <p className="text-muted-foreground border-t pt-4 text-sm">
          Save as Assessment first, then reopen edit to manage questions.
        </p>
      )}

      <Dialog open={!!quizToDelete} onOpenChange={() => setQuizToDelete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete question?</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            This assessment question will be removed. You can undo via restore
            if soft-deleted on the server.
          </p>
          <DialogFooter className="mt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setQuizToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteQuiz}
              disabled={isDeletingQuiz}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add assessment question</DialogTitle>
            <p className="text-muted-foreground text-sm">
              Fill in the question details below.
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Question type</Label>
                <Select
                  value={newQuiz.type}
                  onValueChange={(value: "MULTIPLE_CHOICE" | "WRITE_ANSWER") =>
                    setNewQuiz({ ...newQuiz, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MULTIPLE_CHOICE">
                      Multiple choice
                    </SelectItem>
                    <SelectItem value="WRITE_ANSWER">Write answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newQuiz.type === "MULTIPLE_CHOICE" && (
                <div className="space-y-1.5">
                  <Label className="text-xs">Correct option</Label>
                  <Select
                    value={newQuiz.rightAnswer}
                    onValueChange={(val) =>
                      setNewQuiz({ ...newQuiz, rightAnswer: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["A", "B", "C", "D"].map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Question text</Label>
              <Textarea
                rows={2}
                placeholder="Enter your question…"
                value={newQuiz.question}
                onChange={(e) =>
                  setNewQuiz({ ...newQuiz, question: e.target.value })
                }
              />
            </div>

            {newQuiz.type === "MULTIPLE_CHOICE" && newQuiz.options && (
              <div className="space-y-1.5">
                <Label className="text-xs">Options</Label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {Object.entries(newQuiz.options).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="bg-muted text-muted-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-semibold">
                        {key}
                      </span>
                      <Input
                        placeholder={`Option ${key}`}
                        value={value}
                        onChange={(e) =>
                          setNewQuiz({
                            ...newQuiz,
                            options: {
                              ...newQuiz.options!,
                              [key]: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {newQuiz.type === "WRITE_ANSWER" && (
              <div className="space-y-1.5">
                <Label className="text-xs">Expected answer</Label>
                <Textarea
                  rows={2}
                  placeholder="Enter the correct answer…"
                  value={newQuiz.rightAnswer}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, rightAnswer: e.target.value })
                  }
                />
              </div>
            )}
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddQuiz} disabled={isAddingQuiz}>
              {isAddingQuiz ? "Adding..." : "Add question"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
