"use client";

import { cn } from "@/lib/utils";
import {
  CourseContentTypeEnum,
  CourseContents,
  CourseTreeItem,
  ChapterTreeNode,
  ContentTreeNode,
  SemesterTreeNode,
} from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  CirclePlay,
  ExternalLink,
  FileText,
  FolderOpen,
  Link2,
  Type,
} from "lucide-react";

export function contentTypeIcon(type: CourseContentTypeEnum) {
  switch (type) {
    case "VIDEO":
      return CirclePlay;
    case "VIDEO_LINK":
      return Link2;
    case "PDF":
      return FileText;
    case "QUIZ":
      return Brain;
    case "TEXT":
      return Type;
    case "MEETING_LINK":
      return ExternalLink;
    default:
      return FileText;
  }
}

function DoneCheck({ active }: { active?: boolean }) {
  return (
    <CheckCircle2
      className={cn(
        "h-4 w-4 shrink-0",
        active ? "text-primary-foreground" : "text-[var(--perf-quiz)]",
      )}
      aria-label="Completed"
    />
  );
}

function ContentRow({
  content,
  isActive,
  isDone,
  onSelect,
  nested = false,
}: {
  content: CourseContents;
  isActive: boolean;
  isDone?: boolean;
  onSelect: (content: CourseContents) => void;
  nested?: boolean;
}) {
  const Icon = contentTypeIcon(content.type);

  return (
    <button
      type="button"
      onClick={() => onSelect(content)}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors",
        nested && "pl-4",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-secondary/40",
        isDone && !isActive && "text-[var(--perf-quiz)]",
      )}
    >
      <Icon className="h-4 w-4 shrink-0 opacity-80" />
      <span className="line-clamp-2 flex-1 font-medium leading-snug">
        {content.title}
      </span>
      {isDone && <DoneCheck active={isActive} />}
    </button>
  );
}

type CourseCurriculumTreeProps = {
  items: CourseTreeItem[];
  activeContentId?: string;
  openSemesterId?: string;
  openChapterId?: string;
  completedContentIds?: Set<string> | string[];
  onSelectContent: (content: CourseContents) => void;
  onOpenSemester?: (semesterId: string | undefined) => void;
  onOpenChapter?: (chapterId: string | undefined) => void;
  interactive?: boolean;
  className?: string;
};

function toCompletedSet(ids?: Set<string> | string[]) {
  if (!ids) return new Set<string>();
  return ids instanceof Set ? ids : new Set(ids);
}

function isChapterDone(chapter: ChapterTreeNode, completed: Set<string>) {
  const contents = chapter.contents || [];
  if (!contents.length) return false;
  return contents.every((c) => completed.has(c.id));
}

export default function CourseCurriculumTree({
  items,
  activeContentId,
  openSemesterId,
  openChapterId,
  completedContentIds,
  onSelectContent,
  onOpenSemester,
  onOpenChapter,
  interactive = true,
  className,
}: CourseCurriculumTreeProps) {
  const completed = toCompletedSet(completedContentIds);

  if (!items.length) {
    return (
      <p className="px-1 py-4 text-sm text-muted-foreground">
        No published content yet.
      </p>
    );
  }

  const semesterValue = openSemesterId ? [openSemesterId] : [];

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {items.map((item) => {
        if (item.nodeType === "CONTENT") {
          return (
            <ContentRow
              key={item.id}
              content={item}
              isActive={activeContentId === item.id}
              isDone={completed.has(item.id)}
              onSelect={onSelectContent}
            />
          );
        }

        const semester = item as SemesterTreeNode;

        if (!interactive) {
          return (
            <div key={semester.id} className="space-y-1 border-b border-border/60 pb-3 last:border-0">
              <div className="flex items-center gap-2 px-1 py-2 text-sm font-semibold text-foreground">
                <FolderOpen className="h-4 w-4 text-primary" />
                {semester.name}
              </div>
              <SemesterChildren
                semester={semester}
                activeContentId={activeContentId}
                openChapterId={openChapterId}
                completed={completed}
                onSelectContent={onSelectContent}
                interactive={false}
              />
            </div>
          );
        }

        return (
          <Accordion
            key={semester.id}
            type="multiple"
            value={semesterValue}
            onValueChange={(values) => {
              const next = values[values.length - 1];
              onOpenSemester?.(next);
            }}
            className="w-full"
          >
            <AccordionItem value={semester.id} className="border-border/70">
              <AccordionTrigger className="px-2 py-3 text-sm font-semibold hover:no-underline">
                <span className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-primary" />
                  {semester.name}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <SemesterChildren
                  semester={semester}
                  activeContentId={activeContentId}
                  openChapterId={openChapterId}
                  completed={completed}
                  onSelectContent={onSelectContent}
                  onOpenChapter={onOpenChapter}
                  interactive
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
}

function SemesterChildren({
  semester,
  activeContentId,
  openChapterId,
  completed,
  onSelectContent,
  onOpenChapter,
  interactive,
}: {
  semester: SemesterTreeNode;
  activeContentId?: string;
  openChapterId?: string;
  completed: Set<string>;
  onSelectContent: (content: CourseContents) => void;
  onOpenChapter?: (chapterId: string | undefined) => void;
  interactive: boolean;
}) {
  const chapterValue = openChapterId ? [openChapterId] : [];

  return (
    <div className="flex flex-col gap-0.5 pl-1">
      {(semester.items || []).map((child) => {
        if (child.nodeType === "CONTENT") {
          return (
            <ContentRow
              key={child.id}
              content={child as ContentTreeNode}
              isActive={activeContentId === child.id}
              isDone={completed.has(child.id)}
              onSelect={onSelectContent}
              nested
            />
          );
        }

        const chapter = child as ChapterTreeNode;
        const chapterDone = isChapterDone(chapter, completed);

        if (!interactive) {
          return (
            <div key={chapter.id} className="mt-1 space-y-0.5">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                <span className="flex-1">{chapter.name}</span>
                {chapterDone && <DoneCheck />}
              </div>
              {(chapter.contents || []).map((content) => (
                <ContentRow
                  key={content.id}
                  content={content}
                  isActive={activeContentId === content.id}
                  isDone={completed.has(content.id)}
                  onSelect={onSelectContent}
                  nested
                />
              ))}
            </div>
          );
        }

        return (
          <Accordion
            key={chapter.id}
            type="multiple"
            value={chapterValue}
            onValueChange={(values) => {
              const next = values[values.length - 1];
              onOpenChapter?.(next);
            }}
            className="w-full"
          >
            <AccordionItem value={chapter.id} className="border-none">
              <AccordionTrigger className="px-3 py-2.5 text-sm font-medium hover:no-underline">
                <span className="flex w-full items-center gap-2 pr-2">
                  <BookOpen className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="flex-1 text-left">{chapter.name}</span>
                  {chapterDone && <DoneCheck />}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-1">
                <div className="flex flex-col gap-0.5 border-l border-border/70 ml-3 pl-1">
                  {(chapter.contents || []).map((content) => (
                    <ContentRow
                      key={content.id}
                      content={content}
                      isActive={activeContentId === content.id}
                      isDone={completed.has(content.id)}
                      onSelect={onSelectContent}
                      nested
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
}
