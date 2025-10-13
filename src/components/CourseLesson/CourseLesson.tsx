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
import Loading from "../Global/Loading";

const CourseLesson = ({ slug }: { slug: string }) => {
  const token = useAppSelector(useCurrentToken);
  const searchParams = useSearchParams();
  const moduleId = searchParams.get("module");
  const router = useRouter();

  if (!token) {
    router.push("/auth/sign-in");
  }

  const [completeCourse, { isLoading: completeCourseLoading }] =
    useToggleCompleteCourseMutation();

  const { data: course, isLoading: courseLoading } =
    useGetCourseByIdQuery(slug);

  const { data, isLoading } = useGetAllContentForSpecificCourseQuery(slug);

  if (isLoading || courseLoading) {
    return <Loading/>; 
  }

  const courseContents = data?.data || [];
  const courseData = course?.data;
  const isCourseComplete = (courseData?.completeCourses || [])?.length > 0;

  const selectedContents = courseContents?.find(
    (item) => item.id === moduleId,
  );


  const handleChangeModuleItem = (id: string) => {
    handleSetSearchParams({ module: `${id}` }, searchParams, router);
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
                disabled={moduleId === courseContents[0].id}
                onClick={() => {
                  const currentIndex = courseContents.findIndex(
                    (obj) => obj.id === selectedContents.id,
                  );
                  const previousContent = courseContents[currentIndex - 1];
                  if (previousContent)
                    handleChangeModuleItem(previousContent.id);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <Button
                disabled={
                  moduleId ===
                  courseContents[courseContents.length - 1].id
                }
                onClick={() => {
                  const currentId = courseContents.findIndex(
                    (obj) => obj.id === selectedContents.id,
                  );
                  const nextContent = courseContents[currentId + 1];
                  if (nextContent) handleChangeModuleItem(nextContent.id);
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
