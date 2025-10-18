/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToggleDeleteCourseMutation } from "@/redux/api/courseApi";
import { toast } from "sonner";

interface DeleteCourseProps {
  courseId: string;
}

export default function DeleteCourse({ courseId }: DeleteCourseProps) {
  const [isOpen, setIsOpen] = useState(false); // control dialog open state
  const [deleteCourse, { isLoading }] = useToggleDeleteCourseMutation();

  const handleDelete = async () => {
    try {
      await deleteCourse(courseId).unwrap();
      toast.success("Course deleted successfully!");
      setIsOpen(false); // close dialog after success
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete the course.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="destructive"
        size="icon"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 size={16} />
      </Button>

      <DialogContent className="!max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Course</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this course? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
