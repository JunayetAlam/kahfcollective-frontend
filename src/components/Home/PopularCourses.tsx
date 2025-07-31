import { courses } from "@/data";
import Container from "../Global/Container";
import Title from "../Global/Title";
import TopTitle from "../Global/TopTitle";
import CourseCard from "../Global/CourseCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PopularCourses() {
  return (
    <Container className="pb-20">
      {/* Header Section with See All button */}
      <div className="flex flex-col sm:flex-row justify-between items-end pb-4 sm:pb-8 space-y-8 sm:space-y-0">
        <div className="text-center sm:text-left w-full">
          <TopTitle className="justify-center sm:justify-start">Special Courses</TopTitle>
          <Title>Our Popular Courses</Title>
        </div>
        {/* "See All" Button */}
        <Link href="/courses">
          <Button size="lg" variant="outline" className="px-10 border-primary text-primary">
            See All
          </Button>
        </Link>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {courses.slice(0, 4).map((item, idx) => (
          <CourseCard key={idx} course={item} />
        ))}
      </div>
    </Container>
  );
}
