'use client'

import Container from "../Global/Container";

import C_Search from "./C_Search";
import CourseCard from "../Global/CourseCard";
import { Pagination } from "../Global/Pagination";
import { useSearchParams } from "next/navigation";
import { TQueryParam } from "@/types";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";

export default function Courses() {
    const searchParams = useSearchParams();
    const searchTerm = searchParams.get("searchTerm");
    const args: TQueryParam[] = []
    if (searchTerm) args.push({ name: "searchTerm", value: searchTerm })
    const { data, isLoading } = useGetAllCoursesQuery(args);
    if (isLoading) {
        return ''
    }
    const courses = data?.data || [];
    return (
        <Container className="py-20 relative">
            <div className="space-y-8">
                {/* Desktop Sidebar */}
                <div className="w-full flex-shrink-0">
                    <C_Search />
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {
                        courses.length < 1 && <p className="text-center py-20">Course Not Found</p>
                    }

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                        {
                            courses.slice(0, 3).map((item, idx) => <CourseCard key={idx} course={item} />)
                        }
                    </div>
                </div>

            </div>
            <Pagination totalPages={data?.meta?.totalPage || 0} />
        </Container>
    );
}