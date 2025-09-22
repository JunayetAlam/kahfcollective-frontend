'use client'
import Link from "next/link";
import Container from "../Global/Container";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import VideoPlayer from "../Global/VideoPlayer";
import { Button } from "../ui/button";
import CourseModuleList from "./CourseModuleList";
import TopTitle from "../Global/TopTitle";
import Subtitle from "../Global/Subtitle";
import QuizPage from "./ModuleQuiz";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { useCurrentToken } from "@/redux/authSlice";
import { useGetAllContentForSpecificCourseQuery } from "@/redux/api/courseContent";
import Quiz from "./Quiz/Quiz";
import { useGetCourseByIdQuery, useToggleCompleteCourseMutation } from "@/redux/api/courseApi";
import Title from "../Global/Title";
import { handleSetSearchParams } from "@/lib/utils";
import Spinner from "../Global/Spinner";

export default function CourseLesson({ slug }: { slug: string }) {
    const token = useAppSelector(useCurrentToken);
    const searchParams = useSearchParams();
    const index = searchParams.get("module")
    const router = useRouter()
    if (!token) {
        router.push('/auth/sign-in')
    }
    const [completeCourse, { isLoading: completeCourseLoading }] = useToggleCompleteCourseMutation()
    const { data: course, isLoading: courseLoading } = useGetCourseByIdQuery(slug);

    const { data, isLoading } = useGetAllContentForSpecificCourseQuery(slug)
    if (isLoading || courseLoading) {
        return ''
    };
    const courseContents = data?.data || [];
    const courseData = course?.data
    const isCourseComplete = (courseData?.completeCourses || [])?.length > 0
    const selectedContents = courseContents.find(item => item.index === Number(index));
    console.log(courseData)
    const handleChangeModuleItem = (index: number) => {
        if (index === courseContents[0].index) {
            return
        }
        handleSetSearchParams(
            { module: `${index}` },
            searchParams,
            router
        );
    };
    return (
        <Container className="pb-20 pt-40">

            <header className="w-full  mb-6">
                <Link href={`/course-details/${slug}`} className="flex items-center text-sm text-gray-600 hover:underline mb-4">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Courses
                </Link>
                <TopTitle>{courseData?.title}</TopTitle>
                <Subtitle>{courseData?.description}</Subtitle>
            </header>

            <main className="space-y-8">
                {
                    selectedContents && <>
                        <Title>{selectedContents.title}</Title>
                        {
                            selectedContents?.type === 'QUIZ' ? <Quiz contents={selectedContents} /> : <VideoPlayer contents={selectedContents} />
                        }



                        <div className="w-full  flex justify-between gap-4">
                            <Button
                                disabled={Number(index) === courseContents[0].index}
                                onClick={() => {
                                    const currentIndex = courseContents.findIndex(obj => obj.index === selectedContents.index);
                                    const previousContent = courseContents[currentIndex - 1];

                                    handleChangeModuleItem(previousContent.index)
                                }}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <Button
                                disabled={Number(index) === courseContents[courseContents.length - 1].index}
                                onClick={() => {
                                    const currentIndex = courseContents.findIndex(obj => obj.index === selectedContents.index);
                                    const nextContent = courseContents[currentIndex + 1];

                                    handleChangeModuleItem(nextContent.index)
                                }}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                    </>
                }
                <CourseModuleList courseContents={courseContents} />

                <div className="w-full  pt-4">
                    <Button onClick={async () => await completeCourse(slug).unwrap()} disabled={isCourseComplete} variant={"secondary"} size={"lg"} className="w-full ">
                        {
                          completeCourseLoading ? <span className="flex justify-center items-center gap-1"><Spinner/> Completing</span> :  isCourseComplete ? 'Course Completed' : ' Complete Course'
                        }
                        <CheckCircle className="h-5 w-5" />
                    </Button>
                </div>
            </main>
        </Container>
    );
}