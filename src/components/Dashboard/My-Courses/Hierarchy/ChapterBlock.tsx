"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChapterTreeNode, Course } from "@/types";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { MF_ContentForm } from "../MF_ContentForm";
import { ContentRow } from "./ContentRow";
import { DroppableContainer } from "./DroppableContainer";
import { RenameDialog } from "./RenameDialog";
import { encodeItemId } from "./hierarchyDnD";
import { CourseContents } from "@/types";

export function ChapterBlock({
  chapter,
  courseData,
  onRename,
  onDelete,
  onDeleteContent,
}: {
  chapter: ChapterTreeNode;
  courseData: Course;
  onRename: (id: string, name: string) => Promise<void>;
  onDelete: (id: string, name: string) => void;
  onDeleteContent: (content: CourseContents) => void;
}) {
  const [open, setOpen] = useState(true);
  const id = encodeItemId("CHAPTER", chapter.id);
  const contentIds = chapter.contents.map((c) => encodeItemId("CONTENT", c.id));

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data: { kind: "CHAPTER", item: chapter } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-muted/30 rounded-md border"
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-2 px-2 py-2">
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground cursor-grab touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ChevronDown
                className={`h-4 w-4 transition-transform ${open ? "" : "-rotate-90"}`}
              />
            </Button>
          </CollapsibleTrigger>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{chapter.name}</p>
            <p className="text-muted-foreground text-xs">
              Chapter · {chapter.contents.length} content
            </p>
          </div>

          <MF_ContentForm
            courseData={courseData}
            semesterId={chapter.semesterId}
            chapterId={chapter.id}
            scopeLabel={`Chapter: ${chapter.name}`}
            trigger={
              <Button size="sm" variant="outline">
                <Plus className="mr-1 h-3.5 w-3.5" />
                Content
              </Button>
            }
          />
          <RenameDialog
            title="Rename chapter"
            initialName={chapter.name}
            onSave={(name) => onRename(chapter.id, name)}
            trigger={
              <Button size="icon" variant="ghost">
                <Pencil className="h-4 w-4" />
              </Button>
            }
          />
          <Button
            size="icon"
            variant="ghost"
            className="text-destructive"
            onClick={() => onDelete(chapter.id, chapter.name)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <CollapsibleContent>
          <SortableContext
            items={contentIds}
            strategy={verticalListSortingStrategy}
          >
            <DroppableContainer
              kind="CHAPTER"
              id={chapter.id}
              className="mx-2 mb-2 ml-8"
              emptyLabel="No content in this chapter — add or drop here"
            >
              {chapter.contents.map((content) => (
                <ContentRow
                  key={content.id}
                  content={content}
                  onDelete={onDeleteContent}
                />
              ))}
            </DroppableContainer>
          </SortableContext>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
