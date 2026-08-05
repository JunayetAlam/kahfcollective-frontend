"use client";

import { Course, CourseContents, CourseTreeItem, SemesterTreeNode } from "@/types";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useChangeChapterIndexMutation, useMoveChapterMutation } from "@/redux/api/chapterApi";
import {
  useChangeContentIndexMutation,
  useMoveContentMutation,
} from "@/redux/api/courseContent";
import { useChangeSemesterIndexMutation } from "@/redux/api/semesterApi";
import { toast } from "sonner";
import { ContentRow } from "./ContentRow";
import { DroppableContainer } from "./DroppableContainer";
import { SemesterBlock } from "./SemesterBlock";
import {
  buildLocationMap,
  encodeItemId,
  isDropAllowed,
  parseItemId,
  resolveDropTarget,
} from "./hierarchyDnD";

export function HierarchyTree({
  courseData,
  items,
  onRenameSemester,
  onDeleteSemester,
  onRenameChapter,
  onDeleteChapter,
  onDeleteContent,
}: {
  courseData: Course;
  items: CourseTreeItem[];
  onRenameSemester: (id: string, name: string) => Promise<void>;
  onDeleteSemester: (id: string, name: string) => void;
  onRenameChapter: (id: string, name: string) => Promise<void>;
  onDeleteChapter: (id: string, name: string) => void;
  onDeleteContent: (content: CourseContents) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const [changeSemesterIndex] = useChangeSemesterIndexMutation();
  const [changeChapterIndex] = useChangeChapterIndexMutation();
  const [moveChapter] = useMoveChapterMutation();
  const [changeContentIndex] = useChangeContentIndexMutation();
  const [moveContent] = useMoveContentMutation();

  const locationMap = buildLocationMap(courseData.id, items);
  const courseItemIds = items.map((item) =>
    item.nodeType === "SEMESTER"
      ? encodeItemId("SEMESTER", item.id)
      : encodeItemId("CONTENT", item.id),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeParsed = parseItemId(String(active.id));
    if (!activeParsed) return;

    const activeLoc = locationMap.get(
      encodeItemId(activeParsed.kind, activeParsed.id),
    );
    if (!activeLoc) return;

    const target = resolveDropTarget({
      overId: String(over.id),
      locationMap,
      courseId: courseData.id,
      activeKind: activeParsed.kind,
    });
    if (!target) return;

    if (!isDropAllowed(activeParsed.kind, target.container)) {
      toast.error("That drop target is not allowed for this item");
      return;
    }

    const sameContainer =
      activeLoc.container === target.container &&
      activeLoc.containerId === target.containerId;

    let newIndex = target.insertIndex;
    if (sameContainer) {
      const listLen = [...locationMap.values()].filter(
        (loc) =>
          loc.container === activeLoc.container &&
          loc.containerId === activeLoc.containerId,
      ).length;
      if (newIndex > listLen) newIndex = listLen;
      if (newIndex === activeLoc.index) return;
    }

    try {
      if (activeParsed.kind === "SEMESTER") {
        if (!sameContainer) {
          toast.error("Semesters can only be reordered in the course");
          return;
        }
        await changeSemesterIndex({
          id: activeParsed.id,
          newIndex,
        }).unwrap();
        return;
      }

      if (activeParsed.kind === "CHAPTER") {
        if (sameContainer) {
          await changeChapterIndex({
            id: activeParsed.id,
            newIndex,
          }).unwrap();
        } else {
          await moveChapter({
            id: activeParsed.id,
            semesterId: target.containerId,
            newIndex,
          }).unwrap();
        }
        return;
      }

      // CONTENT
      if (sameContainer) {
        await changeContentIndex({
          id: activeParsed.id,
          newIndex,
        }).unwrap();
      } else if (target.container === "COURSE") {
        await moveContent({
          id: activeParsed.id,
          scope: "COURSE",
          semesterId: null,
          chapterId: null,
          newIndex,
        }).unwrap();
      } else if (target.container === "SEMESTER") {
        await moveContent({
          id: activeParsed.id,
          scope: "SEMESTER",
          semesterId: target.containerId,
          chapterId: null,
          newIndex,
        }).unwrap();
      } else {
        await moveContent({
          id: activeParsed.id,
          scope: "CHAPTER",
          semesterId: target.semesterId,
          chapterId: target.containerId,
          newIndex,
        }).unwrap();
      }
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to reorder";
      toast.error(message);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={courseItemIds}
        strategy={verticalListSortingStrategy}
      >
        <DroppableContainer
          kind="COURSE"
          id={courseData.id}
          emptyLabel="No semesters or content yet — add a semester or content"
        >
          {items.map((item) =>
            item.nodeType === "SEMESTER" ? (
              <SemesterBlock
                key={item.id}
                semester={item as SemesterTreeNode}
                courseData={courseData}
                onRename={onRenameSemester}
                onDelete={onDeleteSemester}
                onRenameChapter={onRenameChapter}
                onDeleteChapter={onDeleteChapter}
                onDeleteContent={onDeleteContent}
              />
            ) : (
              <ContentRow
                key={item.id}
                content={item}
                onDelete={onDeleteContent}
              />
            ),
          )}
        </DroppableContainer>
      </SortableContext>
    </DndContext>
  );
}
