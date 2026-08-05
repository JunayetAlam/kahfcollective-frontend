import {
  ChapterTreeNode,
  ContentTreeNode,
  CourseTreeItem,
  SemesterTreeNode,
} from "@/types";

export type DnDKind = "SEMESTER" | "CHAPTER" | "CONTENT";
export type ContainerKind = "COURSE" | "SEMESTER" | "CHAPTER";

export type ItemLocation = {
  kind: DnDKind;
  id: string;
  container: ContainerKind;
  containerId: string; // courseId | semesterId | chapterId
  semesterId?: string;
  chapterId?: string;
  index: number; // 1-based
};

export const encodeItemId = (kind: DnDKind, id: string) =>
  `${kind === "SEMESTER" ? "sem" : kind === "CHAPTER" ? "ch" : "ct"}:${id}`;

export const encodeContainerId = (kind: ContainerKind, id: string) =>
  `container:${kind === "COURSE" ? "course" : kind === "SEMESTER" ? "sem" : "ch"}:${id}`;

export const parseItemId = (
  raw: string,
): { kind: DnDKind; id: string } | null => {
  if (raw.startsWith("sem:"))
    return { kind: "SEMESTER", id: raw.slice(4) };
  if (raw.startsWith("ch:")) return { kind: "CHAPTER", id: raw.slice(3) };
  if (raw.startsWith("ct:")) return { kind: "CONTENT", id: raw.slice(3) };
  return null;
};

export const parseContainerId = (
  raw: string,
): { kind: ContainerKind; id: string } | null => {
  if (raw.startsWith("container:course:"))
    return { kind: "COURSE", id: raw.slice("container:course:".length) };
  if (raw.startsWith("container:sem:"))
    return { kind: "SEMESTER", id: raw.slice("container:sem:".length) };
  if (raw.startsWith("container:ch:"))
    return { kind: "CHAPTER", id: raw.slice("container:ch:".length) };
  return null;
};

export const buildLocationMap = (
  courseId: string,
  items: CourseTreeItem[],
): Map<string, ItemLocation> => {
  const map = new Map<string, ItemLocation>();

  items.forEach((item, i) => {
    if (item.nodeType === "SEMESTER") {
      const semester = item as SemesterTreeNode;
      map.set(encodeItemId("SEMESTER", semester.id), {
        kind: "SEMESTER",
        id: semester.id,
        container: "COURSE",
        containerId: courseId,
        index: i + 1,
      });

      semester.items.forEach((child, j) => {
        if (child.nodeType === "CHAPTER") {
          const chapter = child as ChapterTreeNode;
          map.set(encodeItemId("CHAPTER", chapter.id), {
            kind: "CHAPTER",
            id: chapter.id,
            container: "SEMESTER",
            containerId: semester.id,
            semesterId: semester.id,
            index: j + 1,
          });

          chapter.contents.forEach((content, k) => {
            map.set(encodeItemId("CONTENT", content.id), {
              kind: "CONTENT",
              id: content.id,
              container: "CHAPTER",
              containerId: chapter.id,
              semesterId: semester.id,
              chapterId: chapter.id,
              index: k + 1,
            });
          });
        } else {
          const content = child as ContentTreeNode;
          map.set(encodeItemId("CONTENT", content.id), {
            kind: "CONTENT",
            id: content.id,
            container: "SEMESTER",
            containerId: semester.id,
            semesterId: semester.id,
            index: j + 1,
          });
        }
      });
    } else {
      const content = item as ContentTreeNode;
      map.set(encodeItemId("CONTENT", content.id), {
        kind: "CONTENT",
        id: content.id,
        container: "COURSE",
        containerId: courseId,
        index: i + 1,
      });
    }
  });

  return map;
};

export const getContainerItemIds = (
  courseId: string,
  items: CourseTreeItem[],
  container: ContainerKind,
  containerId: string,
): string[] => {
  if (container === "COURSE" && containerId === courseId) {
    return items.map((item) =>
      item.nodeType === "SEMESTER"
        ? encodeItemId("SEMESTER", item.id)
        : encodeItemId("CONTENT", item.id),
    );
  }

  if (container === "SEMESTER") {
    const semester = items.find(
      (i): i is SemesterTreeNode =>
        i.nodeType === "SEMESTER" && i.id === containerId,
    );
    if (!semester) return [];
    return semester.items.map((child) =>
      child.nodeType === "CHAPTER"
        ? encodeItemId("CHAPTER", child.id)
        : encodeItemId("CONTENT", child.id),
    );
  }

  if (container === "CHAPTER") {
    for (const item of items) {
      if (item.nodeType !== "SEMESTER") continue;
      const chapter = item.items.find(
        (c): c is ChapterTreeNode =>
          c.nodeType === "CHAPTER" && c.id === containerId,
      );
      if (chapter) {
        return chapter.contents.map((c) => encodeItemId("CONTENT", c.id));
      }
    }
  }

  return [];
};

export const resolveDropTarget = ({
  overId,
  locationMap,
  courseId,
  activeKind,
}: {
  overId: string;
  locationMap: Map<string, ItemLocation>;
  courseId: string;
  activeKind: DnDKind;
}): {
  container: ContainerKind;
  containerId: string;
  semesterId?: string;
  chapterId?: string;
  insertIndex: number; // 1-based; when over an item, use that item's index
} | null => {
  const asContainer = parseContainerId(overId);
  if (asContainer) {
    const ids = [...locationMap.values()].filter(
      (loc) =>
        loc.container === asContainer.kind &&
        loc.containerId === asContainer.id,
    );
    return {
      container: asContainer.kind,
      containerId: asContainer.id,
      semesterId:
        asContainer.kind === "SEMESTER"
          ? asContainer.id
          : asContainer.kind === "CHAPTER"
            ? [...locationMap.values()].find(
                (l) => l.kind === "CHAPTER" && l.id === asContainer.id,
              )?.semesterId
            : undefined,
      chapterId: asContainer.kind === "CHAPTER" ? asContainer.id : undefined,
      insertIndex: ids.length + 1,
    };
  }

  const overItem = parseItemId(overId);
  if (!overItem) return null;

  // Dropping onto a semester/chapter row nests into that container (when allowed)
  if (
    overItem.kind === "SEMESTER" &&
    (activeKind === "CONTENT" || activeKind === "CHAPTER")
  ) {
    const childCount = [...locationMap.values()].filter(
      (loc) =>
        loc.container === "SEMESTER" && loc.containerId === overItem.id,
    ).length;
    return {
      container: "SEMESTER",
      containerId: overItem.id,
      semesterId: overItem.id,
      insertIndex: childCount + 1,
    };
  }

  if (overItem.kind === "CHAPTER" && activeKind === "CONTENT") {
    const chapterLoc = locationMap.get(
      encodeItemId("CHAPTER", overItem.id),
    );
    const childCount = [...locationMap.values()].filter(
      (loc) =>
        loc.container === "CHAPTER" && loc.containerId === overItem.id,
    ).length;
    return {
      container: "CHAPTER",
      containerId: overItem.id,
      semesterId: chapterLoc?.semesterId,
      chapterId: overItem.id,
      insertIndex: childCount + 1,
    };
  }

  const overLoc = locationMap.get(encodeItemId(overItem.kind, overItem.id));
  if (!overLoc) {
    return {
      container: "COURSE",
      containerId: courseId,
      insertIndex: 1,
    };
  }

  return {
    container: overLoc.container,
    containerId: overLoc.containerId,
    semesterId: overLoc.semesterId,
    chapterId: overLoc.chapterId,
    insertIndex: overLoc.index,
  };
};

/** Chapters cannot live at course root; content can go anywhere allowed. */
export const isDropAllowed = (
  activeKind: DnDKind,
  targetContainer: ContainerKind,
): boolean => {
  if (activeKind === "SEMESTER") return targetContainer === "COURSE";
  if (activeKind === "CHAPTER") return targetContainer === "SEMESTER";
  // CONTENT
  return true;
};
