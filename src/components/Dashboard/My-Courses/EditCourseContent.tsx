/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

import {
  useAddSingleQuizMutation,
  useDeleteSingleQuizMutation,
  useGetAllQuizzesForCourseAdminQuery,
  useUpdateCourseContentMutation,
  useUpdateSingleQuizMutation,
  useUpdateVideoMutationMutation,
} from "@/redux/api/courseContent";

const editSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export default function EditContentForm({
  item,
  onClose,
}: {
  item: any;
  onClose: () => void;
}) {
  const [updateContent, { isLoading: isUpdating }] =
    useUpdateCourseContentMutation();
  const [updateVideo, { isLoading: isUploading }] =
    useUpdateVideoMutationMutation();
  const [updateQuiz, { isLoading: isUpdatingQuiz }] =
    useUpdateSingleQuizMutation();
  const [deleteQuiz, { isLoading: isDeletingQuiz }] =
    useDeleteSingleQuizMutation();
  const [addQuiz, { isLoading: isAddingQuiz }] = useAddSingleQuizMutation();
  const { data: quizzesData, refetch } = useGetAllQuizzesForCourseAdminQuery(
    item?.id,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [quizToDelete, setQuizToDelete] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

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

  const [editingQuiz, setEditingQuiz] = useState<any>({});

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: item.title,
      description: item.description,
      status: item.status,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await updateContent({ id: item.id, data }).unwrap();
      toast.success("Content updated successfully");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleVideoUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a video first");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("id", item.id);
      await updateVideo({ id: item.id, formData }).unwrap();
      toast.success("Video updated successfully");
      setSelectedFile(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Video upload failed");
    }
  };

  const handleQuizUpdate = async (quiz: any) => {
    try {
      const payload = {
        question: quiz.question,
        ...(quiz.type === "MULTIPLE_CHOICE" && { options: quiz.options }),
        rightAnswer: quiz.rightAnswer,
        type: quiz.type,
      };
      await updateQuiz({ id: quiz.id, data: payload }).unwrap();
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
      {/* Content details */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          placeholder="Title"
          {...register("title")}
          disabled={isUpdating}
        />
        {errors.title && (
          <p className="text-sm text-red-500">
            {errors.title.message?.toString()}
          </p>
        )}

        <Textarea
          placeholder="Description"
          rows={4}
          {...register("description")}
          disabled={isUpdating}
        />
        {errors.description && (
          <p className="text-sm text-red-500">
            {errors.description.message?.toString()}
          </p>
        )}

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isUpdating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">DRAFT</SelectItem>
                <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      {/* Quizzes */}
      {item.type === "QUIZ" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Edit Quizzes</h3>
            <Button size="sm" onClick={() => setShowAddDialog(true)}>
              Add Assessment
            </Button>
          </div>

          {quizzesData?.data?.length ? (
            quizzesData.data.map((quiz: any) => {
              const current = editingQuiz[quiz.id] || quiz;
              return (
                <div key={quiz.id} className="space-y-3 rounded border p-4">
                  <div className="space-y-2">
                    <Label>Assessment Type:</Label>
                    <Select
                      value={current.type || "MULTIPLE_CHOICE"}
                      onValueChange={(value: "MULTIPLE_CHOICE" | "WRITE_ANSWER") =>
                        setEditingQuiz({
                          ...editingQuiz,
                          [quiz.id]: { ...current, type: value },
                        })
                      }
                      disabled={isUpdatingQuiz}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Question Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                        <SelectItem value="WRITE_ANSWER">Write Answer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Question:</Label>
                    <Textarea
                      value={current.question}
                      onChange={(e) =>
                        setEditingQuiz({
                          ...editingQuiz,
                          [quiz.id]: { ...current, question: e.target.value },
                        })
                      }
                      disabled={isUpdatingQuiz}
                    />
                  </div>

                  {current.type === "MULTIPLE_CHOICE" && current.options && (
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(current.options).map(([key, value]: any) => (
                        <div key={key} className="flex items-center gap-2">
                          <Badge variant="outline">{key}</Badge>
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
                            disabled={isUpdatingQuiz}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Correct Answer:</Label>
                    {current.type === "WRITE_ANSWER" ? (
                      <Textarea
                        placeholder="Enter correct answer"
                        value={current.rightAnswer}
                        onChange={(e) =>
                          setEditingQuiz({
                            ...editingQuiz,
                            [quiz.id]: { ...current, rightAnswer: e.target.value },
                          })
                        }
                        disabled={isUpdatingQuiz}
                      />
                    ) : (
                      <Select
                        value={current.rightAnswer}
                        onValueChange={(val) =>
                          setEditingQuiz({
                            ...editingQuiz,
                            [quiz.id]: { ...current, rightAnswer: val },
                          })
                        }
                        disabled={isUpdatingQuiz}
                      >
                        <SelectTrigger className="w-32">
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
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      onClick={() => handleQuizUpdate(current)}
                      disabled={isUpdatingQuiz}
                    >
                      {isUpdatingQuiz ? "Updating..." : "Update Assessment"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setQuizToDelete(quiz)}
                      disabled={isDeletingQuiz}
                    >
                      {isDeletingQuiz ? "Deleting..." : "Delete Assessment"}
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">No quizzes found.</p>
          )}
        </div>
      )}

      {/* Video */}
      {item.type === "VIDEO" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Change Video</label>
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            disabled={isUploading}
          />
          {selectedFile && (
            <p className="text-sm">Selected: {selectedFile.name}</p>
          )}
          <Button
            type="button"
            onClick={handleVideoUpload}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Video"}
          </Button>
        </div>
      )}

      {/* Delete Confirmation */}
      <Dialog open={!!quizToDelete} onOpenChange={() => setQuizToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm">Are you sure you want to delete this Assessment?</p>
          <DialogFooter className="mt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setQuizToDelete(null)}
              disabled={isDeletingQuiz}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteQuiz}
              disabled={isDeletingQuiz}
            >
              {isDeletingQuiz ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Assessment Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Assessment</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Assessment Type:</Label>
              <Select
                value={newQuiz.type}
                onValueChange={(value: "MULTIPLE_CHOICE" | "WRITE_ANSWER") =>
                  setNewQuiz({ ...newQuiz, type: value })
                }
                disabled={isAddingQuiz}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Question Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                  <SelectItem value="WRITE_ANSWER">Write Answer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Question:</Label>
              <Textarea
                placeholder="Question"
                value={newQuiz.question}
                onChange={(e) =>
                  setNewQuiz({ ...newQuiz, question: e.target.value })
                }
                disabled={isAddingQuiz}
              />
            </div>

            {newQuiz.type === "MULTIPLE_CHOICE" && newQuiz.options && (
              <>
                {Object.entries(newQuiz.options).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Badge variant="outline">{key}</Badge>
                    <Input
                      placeholder={`Option ${key}`}
                      value={value}
                      onChange={(e) =>
                        setNewQuiz({
                          ...newQuiz,
                          options: { ...newQuiz.options!, [key]: e.target.value },
                        })
                      }
                      disabled={isAddingQuiz}
                    />
                  </div>
                ))}
              </>
            )}

            <div className="space-y-2">
              <Label>Correct Answer:</Label>
              {newQuiz.type === "WRITE_ANSWER" ? (
                <Textarea
                  placeholder="Enter correct answer"
                  value={newQuiz.rightAnswer}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, rightAnswer: e.target.value })
                  }
                  disabled={isAddingQuiz}
                />
              ) : (
                <Select
                  value={newQuiz.rightAnswer}
                  onValueChange={(val) =>
                    setNewQuiz({ ...newQuiz, rightAnswer: val })
                  }
                  disabled={isAddingQuiz}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Correct Answer" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A", "B", "C", "D"].map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              disabled={isAddingQuiz}
            >
              Cancel
            </Button>
            <Button onClick={handleAddQuiz} disabled={isAddingQuiz}>
              {isAddingQuiz ? "Adding..." : "Add Assessment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}