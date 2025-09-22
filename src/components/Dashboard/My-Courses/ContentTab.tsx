/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteCourseContentByIdMutation } from "@/redux/api/courseContent";
import { Course } from "@/types";
import { Pen, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import EditContentForm from "./EditCourseContent";
import { MF_AddContentButton } from "./MC_Button";




export function ContentTab({
  setOpen,
  courseData,
}: {
  setOpen: (s: boolean) => void;
  courseData: Course;
}) {
  const [editingItem, setEditingItem] = useState<
    Course["courseContents"][0] | null
  >(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<
    Course["courseContents"][0] | null
  >(null);
  const [deleteCourseContent] = useDeleteCourseContentByIdMutation();

  const confirmDelete = (item: Course["courseContents"][0]) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteCourseContent(itemToDelete.id).unwrap();
      toast.success("✅ Content deleted successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "❌ Failed to delete content");
    } finally {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Manage Course Content</h3>
      <MF_AddContentButton courseData={courseData} />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courseData.courseContents?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>
                <Badge variant="secondary">{item.type}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{item.status}</Badge>
              </TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => confirmDelete(item)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      onClick={() => {
                        setEditingItem(item);
                        setDialogOpen(true);
                      }}
                    >
                      <Pen />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Edit Content</DialogTitle>
                    </DialogHeader>
                    <EditContentForm
                      item={editingItem}
                      onClose={() => setDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{itemToDelete?.title}</span>? This
            action cannot be undone.
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

      <div className="flex justify-end border-t pt-4">
        <Button type="button" onClick={() => setOpen(false)} variant="outline">
          Close
        </Button>
      </div>
    </div>
  );
}
