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
import { CourseContents } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pen, Trash2 } from "lucide-react";
import { useState } from "react";
import EditContentForm from "../EditCourseContent";
import { encodeItemId } from "./hierarchyDnD";

export function ContentRow({
  content,
  onDelete,
}: {
  content: CourseContents;
  onDelete: (content: CourseContents) => void;
}) {
  const id = encodeItemId("CONTENT", content.id);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data: { kind: "CONTENT", item: content } });

  const [editOpen, setEditOpen] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-background flex items-center gap-2 rounded-md border px-2 py-2"
    >
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground cursor-grab touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{content.title}</p>
        <div className="mt-1 flex gap-2">
          <Badge variant="secondary">{content.type}</Badge>
          <Badge variant="outline">{content.status}</Badge>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button size="icon" variant="outline">
            <Pen className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="!container max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
          </DialogHeader>
          <EditContentForm item={content} onClose={() => setEditOpen(false)} />
        </DialogContent>
      </Dialog>

      <Button
        size="icon"
        variant="destructive"
        onClick={() => onDelete(content)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
