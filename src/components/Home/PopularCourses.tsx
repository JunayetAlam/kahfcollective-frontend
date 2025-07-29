import { courses } from "@/data";
import Container from "../Global/Container";
import Title from "../Global/Title";
import TopTitle from "../Global/TopTitle";
import CourseCard from "../Global/CourseCard";

export default function PopularCourses() {
    return (
        <Container className="pb-20">
            <div className="text-center pb-8">
                <TopTitle className="justify-center">Special Courses</TopTitle>
                <Title>Our  Popular  Courses</Title>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {
                    courses.slice(0, 4).map((item, idx) => <CourseCard key={idx} course={item} />)
                }
            </div>
        </Container>
    );
}