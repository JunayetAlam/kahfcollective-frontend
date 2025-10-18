"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";
import { TQueryParam } from "@/types";
import { Search, Users } from "lucide-react";
import { useState } from "react";
import CreateCourse from "./CreateCourse";
import ManageCourse from "./ManageCourse";
import ManageStudents from "./ManageStudents";
import Loading from "@/components/Global/Loading";
import { useAppSelector } from "@/redux/store";
import { useCurrentUser } from "@/redux/authSlice";
import DeleteCourse from "./DeleteCourse";

export default function CourseManagementDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const role = useAppSelector(useCurrentUser)?.role

  const queryFilter: TQueryParam[] = [{ name: "searchTerm", value: searchTerm }]


  const { data: courses, isLoading } = useGetAllCoursesQuery(queryFilter);


  const allCourses = courses?.data ?? [];
  return (
    <div className="space-y-6 py-6">
      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search courses..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Header with Add Course Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{role === 'INSTRUCTOR' ? 'My Courses' : 'Courses'}</h1>
        {
          role === 'INSTRUCTOR' && <CreateCourse />
        }

      </div>



      {/* Course Cards */}
      <div className="mt-6 space-y-3">
        {isLoading ? (
          <Loading />
        ) : allCourses.length ? (
          allCourses.map((course) => (
            <Card key={course.id} className="w-full">
              <CardHeader className="flex items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-lg font-semibold">{course.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Instructor: <span className="font-medium text-foreground">{course.instructor?.fullName}</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <ManageStudents courseId={course.id} tierId={course.tierId} />
                  <ManageCourse courseId={course.id} />

                  <DeleteCourse courseId={course.id} />
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="text-muted-foreground mb-3 flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course._count?.enrollCourses || 0}</span>
                  </div>

                  <Badge variant="secondary" className="text-xs">
                    {course.status}
                  </Badge>

                  <Badge variant="secondary" className="text-xs">
                    {course?.tier?.name}
                  </Badge>
                </div>

                <p>{course.description}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No courses found for this tier.</p>
        )}
      </div>
    </div>
  );
}
