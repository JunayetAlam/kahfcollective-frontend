"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChapterTreeNode,
  ContentTreeNode,
  Course,
  CourseContents,
  SemesterTreeNode,
} from "@/types";
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
import { AddChapterDialog } from "./AddChapterDialog";
import { ChapterBlock } from "./ChapterBlock";
import { ContentRow } from "./ContentRow";
import { DroppableContainer } from "./DroppableContainer";
import { RenameDialog } from "./RenameDialog";
import { encodeItemId } from "./hierarchyDnD";

export function SemesterBlock({
  semester,
  courseData,
  onRename,
  onDelete,
  onRenameChapter,
  onDeleteChapter,
  onDeleteContent,
}: {
  semester: SemesterTreeNode;
  courseData: Course;
  onRename: (id: string, name: string) => Promise<void>;
  onDelete: (id: string, name: string) => void;
  onRenameChapter: (id: string, name: string) => Promise<void>;
  onDeleteChapter: (id: string, name: string) => void;
  onDeleteContent: (content: CourseContents) => void;
}) {
  const [open, setOpen] = useState(true);
  const id = encodeItemId("SEMESTER", semester.id);
  const childIds = semester.items.map((child) =>
    child.nodeType === "CHAPTER"
      ? encodeItemId("CHAPTER", child.id)
      : encodeItemId("CONTENT", child.id),
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data: { kind: "SEMESTER", item: semester } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-card rounded-lg border shadow-sm"
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2">
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
            <p className="truncate font-semibold">{semester.name}</p>
            <p className="text-muted-foreground text-xs">
              Semester · {semester.items.length} items
            </p>
          </div>

          <AddChapterDialog semesterId={semester.id} />
          <MF_ContentForm
            courseData={courseData}
            semesterId={semester.id}
            scopeLabel={`Semester: ${semester.name}`}
            trigger={
              <Button size="sm" variant="outline">
                <Plus className="mr-1 h-3.5 w-3.5" />
                Content
              </Button>
            }
          />
          <RenameDialog
            title="Rename semester"
            initialName={semester.name}
            onSave={(name) => onRename(semester.id, name)}
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
            onClick={() => onDelete(semester.id, semester.name)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <CollapsibleContent>
          <SortableContext
            items={childIds}
            strategy={verticalListSortingStrategy}
          >
            <DroppableContainer
              kind="SEMESTER"
              id={semester.id}
              className="p-3"
              emptyLabel="No chapters or content — add or drop here"
            >
              {semester.items.map((child) =>
                child.nodeType === "CHAPTER" ? (
                  <ChapterBlock
                    key={child.id}
                    chapter={child as ChapterTreeNode}
                    courseData={courseData}
                    onRename={onRenameChapter}
                    onDelete={onDeleteChapter}
                    onDeleteContent={onDeleteContent}
                  />
                ) : (
                  <ContentRow
                    key={child.id}
                    content={child as ContentTreeNode}
                    onDelete={onDeleteContent}
                  />
                ),
              )}
            </DroppableContainer>
          </SortableContext>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
