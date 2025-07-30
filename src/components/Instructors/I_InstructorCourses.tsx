import Link from "next/link";
import Container from "../Global/Container";
import Subtitle from "../Global/Subtitle";
import TopTitle from "../Global/TopTitle";
import { Button } from "../ui/button";
import { courses } from "@/data";
import CourseCard from "../Global/CourseCard";

export default function I_InstructorCourses() {
    return (
        <Container className="pb-20">
            <div className='flex flex-col sm:flex-row justify-between items-end pb-4 sm:pb-8 space-y-8 sm:space-y-0'>
                <div className='space-y-2 w-full'>
                    <TopTitle className='justify-center sm:justify-start'>Maryam Courses</TopTitle>
                    <Subtitle className='text-center sm:text-start'>Master Skills with Maryam&apos;s Expertise and Guidance</Subtitle>
                </div>
                <Link href={'/courses'}>
                    <Button size={'lg'} variant={'outline'} className='px-10 border-primary text-primary'>See All</Button>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {
                    courses.slice(0, 4).map((item, idx) => <CourseCard hideInstructor key={idx} course={item} />)
                }
            </div>
        </Container>
    );
}