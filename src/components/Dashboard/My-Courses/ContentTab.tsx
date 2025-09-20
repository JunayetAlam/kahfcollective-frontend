"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useDeleteCourseContentByIdMutation,
  useUpdateCourseContentMutation,
} from "@/redux/api/courseContent";
import { Course } from "@/types";
import { Pen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MF_AddContentButton } from "./MC_Button";

// ------------------ Zod Schema ------------------
const editContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});
type EditContentFormType = z.infer<typeof editContentSchema>;

interface EditContentFormProps {
  item: Course["courseContents"][0];
  onSave: (data: EditContentFormType) => Promise<void> | void;
  onClose: () => void;
}

export function EditContentForm({
  item,
  onSave,
  onClose,
}: EditContentFormProps) {
  const { register, handleSubmit, control } = useForm<EditContentFormType>({
    resolver: zodResolver(editContentSchema),
    defaultValues: {
      title: item.title || "",
      description: item.description || "",
      status: item.status || "PUBLISHED",
    },
  });
  const [updateContent, { isLoading }] = useUpdateCourseContentMutation();

  const submitHandler = async (data: EditContentFormType) => {
    try {
      await updateContent({ id: item.id, data }).unwrap();
      toast.success("✅ Content updated");
      await onSave(data);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
      <Input placeholder="Title" {...register("title")} />
      <Textarea placeholder="Description" {...register("description")} />
      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
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
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

interface ContentTabProps {
  setOpen: (s: boolean) => void;
  courseData: Course;
}

export function ContentTab({ setOpen, courseData }: ContentTabProps) {
  const [editingItem, setEditingItem] = useState<
    Course["courseContents"][0] | null
  >(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<
    Course["courseContents"][0] | null
  >(null);

  const [deleteCourseContent] = useDeleteCourseContentByIdMutation();

  const handleSave = async (data: EditContentFormType) => {
    const updated = courseData?.courseContents?.map((c) =>
      c.id === editingItem?.id ? { ...c, ...data } : c,
    );
    console.log("Updated content:", updated);
    setEditingItem(null);
    setDialogOpen(false);
  };

  const confirmDelete = (item: Course["courseContents"][0]) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteCourseContent(itemToDelete.id).unwrap();
      toast.success("✅ Content deleted successfully!");
      const updatedContents = courseData.courseContents.filter(
        (c) => c.id !== itemToDelete.id,
      );
      console.log("Remaining content:", updatedContents);
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
          {courseData?.courseContents?.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title || "_"}</TableCell>
              <TableCell>
                <Badge variant="secondary">{item.type}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{item.status}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
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
                      {editingItem && (
                        <EditContentForm
                          item={editingItem}
                          onSave={handleSave}
                          onClose={() => {
                            setDialogOpen(false);
                            setEditingItem(null);
                          }}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
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

      <div className="flex justify-end space-x-3 border-t pt-4">
        <Button onClick={() => setOpen(false)} variant="outline">
          Close
        </Button>
      </div>
    </div>
  );
}
