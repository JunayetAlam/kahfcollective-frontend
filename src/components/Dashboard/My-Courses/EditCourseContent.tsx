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

import {
  useAddSingleQuizMutation,
  useDeleteSingleQuizMutation,
  useGetAllQuizzesForCourseQuery,
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
  const { data: quizzesData, refetch } = useGetAllQuizzesForCourseQuery(
    item?.id,
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [quizToDelete, setQuizToDelete] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const [newQuiz, setNewQuiz] = useState({
    question: "",
    options: { A: "", B: "", C: "", D: "" },
    rightAnswer: "A",
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
        options: quiz.options,
        rightAnswer: quiz.rightAnswer,
      };
      await updateQuiz({ id: quiz.id, data: payload }).unwrap();
      toast.success("Quiz updated");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update quiz");
    }
  };

  const confirmDeleteQuiz = async () => {
    if (!quizToDelete) return;
    try {
      await deleteQuiz(quizToDelete.id).unwrap();
      toast.success("Quiz deleted");
      refetch();
      setQuizToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete quiz");
    }
  };

  const handleAddQuiz = async () => {
    if (!newQuiz.question.trim()) {
      toast.error("Question is required");
      return;
    }
    try {
      await addQuiz({ courseContentId: item.id, ...newQuiz }).unwrap();
      toast.success("Quiz added");
      setNewQuiz({
        question: "",
        options: { A: "", B: "", C: "", D: "" },
        rightAnswer: "A",
      });
      setShowAddDialog(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add quiz");
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
              Add Quiz
            </Button>
          </div>

          {quizzesData?.data?.length ? (
            quizzesData.data.map((quiz: any) => {
              const current = editingQuiz[quiz.id] || quiz;
              return (
                <div key={quiz.id} className="space-y-3 rounded border p-4">
                  <Input
                    value={current.question}
                    onChange={(e) =>
                      setEditingQuiz({
                        ...editingQuiz,
                        [quiz.id]: { ...current, question: e.target.value },
                      })
                    }
                    disabled={isUpdatingQuiz}
                  />
                  {Object.entries(current.options).map(([key, value]: any) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="w-5 font-medium">{key}</span>
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
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      onClick={() => handleQuizUpdate(current)}
                      disabled={isUpdatingQuiz}
                    >
                      {isUpdatingQuiz ? "Updating..." : "Update Quiz"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setQuizToDelete(quiz)}
                      disabled={isDeletingQuiz}
                    >
                      {isDeletingQuiz ? "Deleting..." : "Delete Quiz"}
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
          <p className="text-sm">Are you sure you want to delete this quiz?</p>
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

      {/* Add Quiz Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Quiz</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Question"
              value={newQuiz.question}
              onChange={(e) =>
                setNewQuiz({ ...newQuiz, question: e.target.value })
              }
              disabled={isAddingQuiz}
            />
            {Object.entries(newQuiz.options).map(([key, value]) => (
              <Input
                key={key}
                placeholder={`Option ${key}`}
                value={value}
                onChange={(e) =>
                  setNewQuiz({
                    ...newQuiz,
                    options: { ...newQuiz.options, [key]: e.target.value },
                  })
                }
                disabled={isAddingQuiz}
              />
            ))}
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
              {isAddingQuiz ? "Adding..." : "Add Quiz"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
