import type {
  ChapterTreeNode,
  ContentTreeNode,
  CourseContents,
  CourseTreeItem,
  SemesterTreeNode,
} from "@/types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { handleSetSearchParams } from "./utils";

export type ContentContext = {
  content: CourseContents;
  semesterId?: string;
  chapterId?: string;
};

function isPublished(content: CourseContents, publishedOnly: boolean) {
  if (!publishedOnly) return true;
  if (!content.status) return true;
  return content.status === "PUBLISHED";
}

function asContentNode(
  node: ContentTreeNode | CourseContents,
): ContentTreeNode {
  if ("nodeType" in node && node.nodeType === "CONTENT") return node;
  return { ...(node as CourseContents), nodeType: "CONTENT" };
}

/** Flatten tree in display order (semesters → chapters → contents). */
export function flattenCourseTree(
  items: CourseTreeItem[] | undefined | null,
  options: { publishedOnly?: boolean } = {},
): CourseContents[] {
  const publishedOnly = options.publishedOnly ?? true;
  const result: CourseContents[] = [];
  if (!items?.length) return result;

  for (const item of items) {
    if (item.nodeType === "CONTENT") {
      if (isPublished(item, publishedOnly)) result.push(item);
      continue;
    }

    const semester = item as SemesterTreeNode;
    for (const child of semester.items || []) {
      if (child.nodeType === "CONTENT") {
        if (isPublished(child, publishedOnly)) result.push(child);
        continue;
      }
      const chapter = child as ChapterTreeNode;
      for (const content of chapter.contents || []) {
        if (isPublished(content, publishedOnly)) result.push(content);
      }
    }
  }

  return result;
}

/** Find a content node and its parent semester/chapter ids. */
export function findContentContext(
  items: CourseTreeItem[] | undefined | null,
  contentId: string,
  options: { publishedOnly?: boolean } = {},
): ContentContext | null {
  const publishedOnly = options.publishedOnly ?? true;
  if (!items?.length || !contentId) return null;

  for (const item of items) {
    if (item.nodeType === "CONTENT") {
      if (item.id === contentId && isPublished(item, publishedOnly)) {
        return { content: item };
      }
      continue;
    }

    const semester = item as SemesterTreeNode;
    for (const child of semester.items || []) {
      if (child.nodeType === "CONTENT") {
        if (child.id === contentId && isPublished(child, publishedOnly)) {
          return { content: child, semesterId: semester.id };
        }
        continue;
      }

      const chapter = child as ChapterTreeNode;
      for (const content of chapter.contents || []) {
        if (content.id === contentId && isPublished(content, publishedOnly)) {
          return {
            content,
            semesterId: semester.id,
            chapterId: chapter.id,
          };
        }
      }
    }
  }

  return null;
}

export function countTreeContents(
  items: CourseTreeItem[] | undefined | null,
  options: { publishedOnly?: boolean; type?: CourseContents["type"] } = {},
): number {
  return flattenCourseTree(items, {
    publishedOnly: options.publishedOnly ?? true,
  }).filter((c) => (options.type ? c.type === options.type : true)).length;
}

export type LessonParams = {
  semester?: string;
  chapter?: string;
  content?: string;
};

/** Read lesson params; fall back to legacy `module` as content. */
export function getLessonParams(
  searchParams: ReadonlyURLSearchParams,
): LessonParams {
  const content =
    searchParams.get("content") || searchParams.get("module") || undefined;
  return {
    semester: searchParams.get("semester") || undefined,
    chapter: searchParams.get("chapter") || undefined,
    content,
  };
}

/**
 * Update semester / chapter / content query params together.
 * Empty string clears a key. Also clears legacy `module`.
 */
export function setLessonParams(
  values: LessonParams,
  searchParams: ReadonlyURLSearchParams,
  router: AppRouterInstance,
) {
  handleSetSearchParams(
    {
      semester: values.semester ?? "",
      chapter: values.chapter ?? "",
      content: values.content ?? "",
      module: "",
    },
    searchParams,
    router,
  );
}

/** Select a content item and write parent context into the URL. */
export function selectContentInUrl(
  items: CourseTreeItem[] | undefined | null,
  contentId: string,
  searchParams: ReadonlyURLSearchParams,
  router: AppRouterInstance,
) {
  const ctx = findContentContext(items, contentId);
  if (!ctx) {
    setLessonParams({ content: contentId }, searchParams, router);
    return;
  }
  setLessonParams(
    {
      semester: ctx.semesterId,
      chapter: ctx.chapterId,
      content: ctx.content.id,
    },
    searchParams,
    router,
  );
}

/** Filter tree to published contents only (keeps empty structure clean). */
export function filterPublishedTree(
  items: CourseTreeItem[] | undefined | null,
): CourseTreeItem[] {
  if (!items?.length) return [];

  const result: CourseTreeItem[] = [];

  for (const item of items) {
    if (item.nodeType === "CONTENT") {
      if (isPublished(item, true)) result.push(asContentNode(item));
      continue;
    }

    const semester = item as SemesterTreeNode;
    const semesterItems: Array<ChapterTreeNode | ContentTreeNode> = [];

    for (const child of semester.items || []) {
      if (child.nodeType === "CONTENT") {
        if (isPublished(child, true)) semesterItems.push(asContentNode(child));
        continue;
      }

      const chapter = child as ChapterTreeNode;
      const contents = (chapter.contents || []).filter((c) =>
        isPublished(c, true),
      );
      if (contents.length > 0) {
        semesterItems.push({ ...chapter, contents });
      }
    }

    if (semesterItems.length > 0) {
      result.push({ ...semester, items: semesterItems });
    }
  }

  return result;
}
