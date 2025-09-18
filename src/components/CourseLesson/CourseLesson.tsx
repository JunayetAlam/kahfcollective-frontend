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
import { courseModules } from "@/data";
import { useAppSelector } from "@/redux/store";
import { useCurrentToken } from "@/redux/authSlice";

export default function CourseLesson({ slug }: { slug: string }) {
    const token = useAppSelector(useCurrentToken);
    const router = useRouter()
    if (!token) {
        router.push('/auth/sign-in')
    }
    const searchParams = useSearchParams();
    const moduleName = searchParams.get('module');
    const moduleItem = searchParams.get('moduleItem');
    const itemData = courseModules.find(item => item.id === moduleName)?.items.find(item => item.id === moduleItem);
    const isQuiz = itemData?.type === 'quiz'
    return (
        <Container className="pb-20 pt-40">
            <header className="w-full  mb-6">
                <Link href={`/course-details/${slug}`} className="flex items-center text-sm text-gray-600 hover:underline mb-4">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Courses
                </Link>
                <TopTitle>Tawheed al-Asma wa&lsquo;s-Sifat</TopTitle>
                <Subtitle>Module 2: Categories of Tawheed</Subtitle>
            </header>

            <main className="space-y-8">
                {
                    isQuiz ? <QuizPage /> : <VideoPlayer />
                }



                <div className="w-full  flex justify-between gap-4">
                    <Button>
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <Button>
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <CourseModuleList />

                <div className="w-full  pt-4">
                    <Button variant={"secondary"} size={"lg"} className="w-full ">
                        Complete Course
                        <CheckCircle className="h-5 w-5" />
                    </Button>
                </div>
            </main>
        </Container>
    );
}