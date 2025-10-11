"use client";

import { handleSetSearchParams } from "@/lib/utils";
import {
  useGetCourseByIdQuery,
  useToggleCompleteCourseMutation,
} from "@/redux/api/courseApi";
import { useGetAllContentForSpecificCourseQuery } from "@/redux/api/courseContent";
import { useCurrentToken } from "@/redux/authSlice";
import { useAppSelector } from "@/redux/store";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "../Global/Container";
import Spinner from "../Global/Spinner";
import Subtitle from "../Global/Subtitle";
import Title from "../Global/Title";
import TopTitle from "../Global/TopTitle";
import VideoPlayer from "../Global/VideoPlayer";
import { Button } from "../ui/button";
import CourseModuleList from "./CourseModuleList";
import Quiz from "./Quiz/Quiz";

const CourseLesson = ({ slug }: { slug: string }) => {
  const token = useAppSelector(useCurrentToken);
  const searchParams = useSearchParams();
  const index = searchParams.get("module");
  const router = useRouter();

  // ✅ Redirect to login if no token
  if (!token) {
    router.push("/auth/sign-in");
  }

  const [completeCourse, { isLoading: completeCourseLoading }] =
    useToggleCompleteCourseMutation();

  const { data: course, isLoading: courseLoading } =
    useGetCourseByIdQuery(slug);

  const { data, isLoading } = useGetAllContentForSpecificCourseQuery(slug);

  if (isLoading || courseLoading) {
    return <Spinner />; // ✅ show loading spinner instead of empty return
  }

  const courseContents = data?.data || [];
  const courseData = course?.data;
  const isCourseComplete = (courseData?.completeCourses || [])?.length > 0;

  const selectedContents = courseContents?.find(
    (item) => item.index === Number(index),
  );

  console.log(courseData);

  const handleChangeModuleItem = (index: number) => {
    handleSetSearchParams({ module: `${index}` }, searchParams, router);
  };

  return (
    <Container className="pt-40 pb-20">
      {/* Header */}
      <header className="mb-6 w-full">
        <Link
          href={`/course-details/${slug}`}
          className="mb-4 flex items-center text-sm text-gray-600 hover:underline"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Courses
        </Link>
        <TopTitle>{courseData?.title}</TopTitle>
        <Subtitle>{courseData?.description}</Subtitle>
      </header>

      <main className="space-y-8">
        {/* Selected Content Section */}
        {selectedContents && (
          <>
            <Title>{selectedContents.title}</Title>

            {/* ✅ Conditional Rendering */}
            {selectedContents?.type === "QUIZ" ? (
              <Quiz contents={selectedContents} />
            ) : <VideoPlayer contents={selectedContents} />}

            {/* Navigation Buttons */}
            <div className="flex w-full justify-between gap-4">
              <Button
                disabled={Number(index) === courseContents[0].index}
                onClick={() => {
                  const currentIndex = courseContents.findIndex(
                    (obj) => obj.index === selectedContents.index,
                  );
                  const previousContent = courseContents[currentIndex - 1];
                  if (previousContent)
                    handleChangeModuleItem(previousContent.index);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <Button
                disabled={
                  Number(index) ===
                  courseContents[courseContents.length - 1].index
                }
                onClick={() => {
                  const currentIndex = courseContents.findIndex(
                    (obj) => obj.index === selectedContents.index,
                  );
                  const nextContent = courseContents[currentIndex + 1];
                  if (nextContent) handleChangeModuleItem(nextContent.index);
                }}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}

        {/* Course Module List */}
        <CourseModuleList courseContents={courseContents} />

        {/* Complete Course Button */}
        <div className="w-full pt-4">
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
    </Container>
  );
};

export default CourseLesson;
