/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteCourseContentByIdMutation } from "@/redux/api/courseContent";
import {
  useToggleDeleteChapterMutation,
  useUpdateChapterMutation,
} from "@/redux/api/chapterApi";
import {
  useToggleDeleteSemesterMutation,
  useUpdateSemesterMutation,
} from "@/redux/api/semesterApi";
import { Course, CourseContents } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { AddSemesterDialog } from "./Hierarchy/AddSemesterDialog";
import { HierarchyTree } from "./Hierarchy/HierarchyTree";
import { MF_ContentForm } from "./MF_ContentForm";

export function ContentTab({
  setOpen,
  courseData,
}: {
  setOpen?: (s: boolean) => void;
  courseData: Course;
}) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: "content" | "semester" | "chapter";
    id: string;
    label: string;
  } | null>(null);

  const [deleteCourseContent] = useDeleteCourseContentByIdMutation();
  const [toggleDeleteSemester] = useToggleDeleteSemesterMutation();
  const [toggleDeleteChapter] = useToggleDeleteChapterMutation();
  const [updateSemester] = useUpdateSemesterMutation();
  const [updateChapter] = useUpdateChapterMutation();

  const items = courseData.items ?? [];

  const confirmDeleteContent = (item: CourseContents) => {
    setItemToDelete({ type: "content", id: item.id, label: item.title });
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteSemester = (id: string, name: string) => {
    setItemToDelete({ type: "semester", id, label: name });
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteChapter = (id: string, name: string) => {
    setItemToDelete({ type: "chapter", id, label: name });
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.type === "content") {
        await deleteCourseContent(itemToDelete.id).unwrap();
        toast.success("Content deleted successfully");
      } else if (itemToDelete.type === "semester") {
        await toggleDeleteSemester(itemToDelete.id).unwrap();
        toast.success("Semester deleted successfully");
      } else {
        await toggleDeleteChapter(itemToDelete.id).unwrap();
        toast.success("Chapter deleted successfully");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete");
    } finally {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const renameSemester = async (id: string, name: string) => {
    await updateSemester({ id, name }).unwrap();
  };

  const renameChapter = async (id: string, name: string) => {
    await updateChapter({ id, name }).unwrap();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Manage Course Content</h3>
          <p className="text-muted-foreground text-sm">
            Semesters, chapters, and content. Drag to reorder or change scope.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AddSemesterDialog courseId={courseData.id} />
          <MF_ContentForm
            courseData={courseData}
            scopeLabel="Course root"
          />
        </div>
      </div>

      <HierarchyTree
        courseData={courseData}
        items={items}
        onRenameSemester={renameSemester}
        onDeleteSemester={confirmDeleteSemester}
        onRenameChapter={renameChapter}
        onDeleteChapter={confirmDeleteChapter}
        onDeleteContent={confirmDeleteContent}
      />

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{itemToDelete?.label}</span>?
          </p>
          <div className="mt-4 flex justify-end gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {setOpen && (
        <div className="flex justify-end border-t pt-4">
          <Button type="button" onClick={() => setOpen(false)} variant="outline">
            Close
          </Button>
        </div>
      )}
    </div>
  );
}
