"use client";

import {
  filterPublishedTree,
  findContentContext,
  flattenCourseTree,
  getLessonParams,
  selectContentInUrl,
  setLessonParams,
} from "@/lib/course-tree";
import {
  useGetCourseByIdQuery,
  useToggleCompleteCourseMutation,
} from "@/redux/api/courseApi";
import { useGetContentByIdQuery } from "@/redux/api/courseContent";
import { useGetCourseCompletedContentIdsQuery } from "@/redux/api/analyticsApi";
import { useCurrentToken } from "@/redux/authSlice";
import { useAppSelector } from "@/redux/store";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import Container from "../Global/Container";
import Loading from "../Global/Loading";
import Spinner from "../Global/Spinner";
import Subtitle from "../Global/Subtitle";
import Title from "../Global/Title";
import TopTitle from "../Global/TopTitle";
import { Button } from "../ui/button";
import ContentPlayer from "./ContentPlayer";
import CourseCurriculumTree from "./CourseCurriculumTree";

const CourseLesson = ({ slug }: { slug: string }) => {
  const token = useAppSelector(useCurrentToken);
  const searchParams = useSearchParams();
  const router = useRouter();
  const didNormalizeUrl = useRef(false);

  const [completeCourse, { isLoading: completeCourseLoading }] =
    useToggleCompleteCourseMutation();

  const { data: course, isLoading: courseLoading } =
    useGetCourseByIdQuery(slug);

  useEffect(() => {
    if (!token) {
      router.push("/auth/sign-in");
    }
  }, [token, router]);

  const courseData = course?.data;
  const treeItems = useMemo(
    () => filterPublishedTree(courseData?.items),
    [courseData?.items],
  );
  const flatContents = useMemo(
    () => flattenCourseTree(treeItems, { publishedOnly: true }),
    [treeItems],
  );

  const lessonParams = getLessonParams(searchParams);
  const contentId = lessonParams.content;

  // Auto-select first content / normalize legacy ?module= / sync parent params once needed
  useEffect(() => {
    if (courseLoading || !flatContents.length || didNormalizeUrl.current) return;

    const legacyModule = searchParams.get("module");
    const currentContent = searchParams.get("content") || legacyModule;

    if (!currentContent) {
      const first = flatContents[0];
      const ctx = findContentContext(treeItems, first.id);
      didNormalizeUrl.current = true;
      setLessonParams(
        {
          semester: ctx?.semesterId,
          chapter: ctx?.chapterId,
          content: first.id,
        },
        searchParams,
        router,
      );
      return;
    }

    const ctx = findContentContext(treeItems, currentContent);
    if (!ctx) {
      const first = flatContents[0];
      const firstCtx = findContentContext(treeItems, first.id);
      didNormalizeUrl.current = true;
      setLessonParams(
        {
          semester: firstCtx?.semesterId,
          chapter: firstCtx?.chapterId,
          content: first.id,
        },
        searchParams,
        router,
      );
      return;
    }

    const needsNormalize =
      Boolean(legacyModule && !searchParams.get("content")) ||
      (ctx.semesterId || "") !== (searchParams.get("semester") || "") ||
      (ctx.chapterId || "") !== (searchParams.get("chapter") || "");

    if (needsNormalize) {
      didNormalizeUrl.current = true;
      setLessonParams(
        {
          semester: ctx.semesterId,
          chapter: ctx.chapterId,
          content: currentContent,
        },
        searchParams,
        router,
      );
    } else {
      didNormalizeUrl.current = true;
    }
  }, [courseLoading, flatContents, treeItems, searchParams, router]);

  const selectedContext = contentId
    ? findContentContext(treeItems, contentId)
    : null;
  const selectedContents = selectedContext?.content;

  const courseId = courseData?.id;
  const { data: serverCompletedIds = [], refetch: refetchCompleted } =
    useGetCourseCompletedContentIdsQuery(courseId || "", {
      skip: !token || !courseId,
    });

  const [localCompletedIds, setLocalCompletedIds] = useState<string[]>([]);

  // Opening a lesson hits GET /course-contents/:id → backend auto-marks progress
  const { isSuccess: contentFetched, fulfilledTimeStamp } = useGetContentByIdQuery(
    selectedContents?.id || "",
    {
      skip:
        !token ||
        !selectedContents?.id ||
        selectedContents.type === "QUIZ",
    },
  );

  useEffect(() => {
    if (!contentFetched || !selectedContents?.id) return;
    if (selectedContents.type === "QUIZ") return;
    setLocalCompletedIds((prev) =>
      prev.includes(selectedContents.id) ? prev : [...prev, selectedContents.id],
    );
    // Sync from server shortly after auto-mark finishes
    const t = setTimeout(() => {
      void refetchCompleted();
    }, 400);
    return () => clearTimeout(t);
  }, [contentFetched, fulfilledTimeStamp, selectedContents?.id, selectedContents?.type, refetchCompleted]);

  const completedContentIds = useMemo(
    () => new Set([...serverCompletedIds, ...localCompletedIds]),
    [serverCompletedIds, localCompletedIds],
  );

  if (courseLoading) {
    return <Loading />;
  }

  const isCourseComplete = (courseData?.completeCourses || []).length > 0;
  const currentIndex = selectedContents
    ? flatContents.findIndex((c) => c.id === selectedContents.id)
    : -1;

  const handleSelectContent = (content: { id: string }) => {
    selectContentInUrl(treeItems, content.id, searchParams, router);
  };

  const handleOpenSemester = (semesterId: string | undefined) => {
    setLessonParams(
      {
        semester: semesterId,
        chapter: semesterId ? lessonParams.chapter : undefined,
        content: lessonParams.content,
      },
      searchParams,
      router,
    );
  };

  const handleOpenChapter = (chapterId: string | undefined) => {
    setLessonParams(
      {
        semester: lessonParams.semester,
        chapter: chapterId,
        content: lessonParams.content,
      },
      searchParams,
      router,
    );
  };

  const goToAdjacent = (delta: number) => {
    const next = flatContents[currentIndex + delta];
    if (!next) return;
    selectContentInUrl(treeItems, next.id, searchParams, router);
  };

  return (
    <Container className="pb-20 pt-40">
      <header className="mb-8 w-full">
        <Link
          href={`/course-details/${slug}`}
          className="mb-4 flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to course
        </Link>
        <TopTitle>{courseData?.title}</TopTitle>
        <Subtitle className="mt-2 line-clamp-2">
          {courseData?.description}
        </Subtitle>
        {flatContents.length > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            {flatContents.length} item{flatContents.length === 1 ? "" : "s"} in
            this course
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="rounded-xl border border-border/70 bg-background p-3 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
            <h2 className="mb-3 px-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Curriculum
            </h2>
            <CourseCurriculumTree
              items={treeItems}
              activeContentId={contentId}
              openSemesterId={lessonParams.semester}
              openChapterId={lessonParams.chapter}
              completedContentIds={completedContentIds}
              onSelectContent={handleSelectContent}
              onOpenSemester={handleOpenSemester}
              onOpenChapter={handleOpenChapter}
            />
          </div>
        </aside>

        <main className="min-w-0 space-y-6 lg:col-span-8 xl:col-span-9">
          {selectedContents ? (
            <>
              <div className="space-y-1">
                <Title>{selectedContents.title}</Title>
                {selectedContents.description && (
                  <Subtitle className="line-clamp-3">
                    {selectedContents.description}
                  </Subtitle>
                )}
              </div>

              <ContentPlayer contents={selectedContents} />

              <div className="flex w-full justify-between gap-4">
                <Button
                  variant="outline"
                  disabled={currentIndex <= 0}
                  onClick={() => goToAdjacent(-1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  disabled={
                    currentIndex < 0 || currentIndex >= flatContents.length - 1
                  }
                  onClick={() => goToAdjacent(1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-dashed border-border/80 px-6 text-center text-sm text-muted-foreground">
              Select a lesson from the curriculum to begin.
            </div>
          )}

          <div className="w-full pt-2">
            <Button
              onClick={async () => await completeCourse(slug).unwrap()}
              disabled={isCourseComplete || completeCourseLoading}
              variant="secondary"
              size="lg"
              className="flex w-full items-center justify-center gap-2"
            >
              {completeCourseLoading ? (
                <>
                  <Spinner /> Completing
                </>
              ) : isCourseComplete ? (
                <>
                  Course Completed <CheckCircle className="h-5 w-5" />
                </>
              ) : (
                <>
                  Complete Course <CheckCircle className="h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </main>
      </div>
    </Container>
  );
};

export default CourseLesson;
