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
import { T_Course } from "@/types";
import { Pen, Trash2 } from "lucide-react";
import { MF_AddContentButton } from "./MC_Button";

// ------------------ Zod Schema ------------------
const editContentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

type EditContentFormType = z.infer<typeof editContentSchema>;

// ------------------ Edit Content Form ------------------
interface EditContentFormProps {
  item: T_Course["courseContents"][0];
  onSave: (data: EditContentFormType) => void;
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
      title: item.title,
      description: item.description ?? "",
      status: item.status as "PUBLISHED",
    },
  });

  const submitHandler = (data: EditContentFormType) => {
    onSave(data); // Save the updated content
    onClose(); // Close the dialog
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
      <Input
        placeholder="Title"
        {...register("title")}
        className="rounded-lg border p-3 shadow-md transition-all focus:ring-2 focus:ring-indigo-400"
      />
      <Textarea
        placeholder="Description"
        {...register("description")}
        className="rounded-lg border p-3 shadow-md transition-all focus:ring-2 focus:ring-indigo-400"
      />
      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="rounded-lg border p-3 shadow-md transition-all focus:ring-2 focus:ring-indigo-400">
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
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}

// ------------------ Content Tab ------------------
interface ContentTabProps {
  setOpen: (s: boolean) => void;
  courseData: T_Course;
}

export function ContentTab({ setOpen, courseData }: ContentTabProps) {
  const [editingItem, setEditingItem] = useState<
    null | T_Course["courseContents"][0]
  >(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSave = (data: EditContentFormType) => {
    console.log("Updated content:", { ...editingItem, ...data });
    setEditingItem(null);
    setDialogOpen(false); // Close the dialog after saving
  };

  const openDialog = (item: T_Course["courseContents"][0]) => {
    setEditingItem(item);
    setDialogOpen(true);
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
          {courseData.courseContents.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title ?? "_"}</TableCell>
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
                    onClick={() => console.log("Delete", item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  {/* Edit Dialog */}
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="icon" onClick={() => openDialog(item)}>
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
                          onClose={() => setDialogOpen(false)}
                          onSave={handleSave}
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

      <div className="flex justify-end space-x-3 border-t pt-4">
        <Button onClick={() => setOpen(false)} variant="outline">
          Close
        </Button>
      </div>
    </div>
  );
}
