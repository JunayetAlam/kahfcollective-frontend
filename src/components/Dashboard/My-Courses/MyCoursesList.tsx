"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetAllCoursesQuery, useToggleAssignCourseToGroupMutation } from "@/redux/api/courseApi";
import { TQueryParam } from "@/types";
import { Eye, Search, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CreateCourse from "./CreateCourse";
import ManageCourse from "./ManageCourse";
import ManageStudents from "./ManageStudents";
import Loading from "@/components/Global/Loading";
import { useAppSelector } from "@/redux/store";
import { useCurrentUser } from "@/redux/authSlice";
import DeleteCourse from "./DeleteCourse";
import { useGetAllClassesQuery } from "@/redux/api/classApi";
import { Button } from "@/components/ui/button";

export default function CourseManagementDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const role = useAppSelector(useCurrentUser)?.role;
  const [toggleGroupAssignInBackend, { isLoading: assignLoading }] =
    useToggleAssignCourseToGroupMutation();
  const { data } = useGetAllClassesQuery([
    { name: "limit", value: "100" },
  ]);
  const classData = data?.data || [];
  const queryFilter: TQueryParam[] = [
    { name: "searchTerm", value: searchTerm },
  ];

  const { data: courses, isLoading } = useGetAllCoursesQuery(queryFilter);

  const allCourses = courses?.data ?? [];
  return (
    <div className="space-y-6 py-6">
      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search coursess..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Header with Add Course Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {role === "INSTRUCTOR" ? "My Courses" : "Courses"}
        </h1>
        <CreateCourse />
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
                  <CardTitle className="text-lg font-semibold">
                    <Link
                      href={`/dashboard/my-courses/${course.id}`}
                      className="hover:text-primary transition-colors hover:underline"
                    >
                      {course.title}
                    </Link>
                  </CardTitle>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Instructor:{" "}
                    <span className="text-foreground font-medium">
                      {course.instructor?.fullName}
                    </span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="sm">
                    <Link href={`/dashboard/my-courses/${course.id}`}>
                      <Eye className="h-4 w-4" />
                      Details
                    </Link>
                  </Button>
                  <ManageStudents
                    courseId={course.id}
                    groups={
                      course.groupCourses?.map((groupCourse) => ({
                        id: groupCourse.group.id,
                        name: groupCourse.group.name,
                      })) || []
                    }
                  />
                  <ManageCourse courseId={course.id} />
                  <DeleteCourse courseId={course.id} />
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="mb-4 flex min-w-[350px] flex-wrap gap-3">
                  {classData?.map((item, index) => (
                    <Button
                      disabled={assignLoading}
                      onClick={() =>
                        toggleGroupAssignInBackend({
                          courseId: course.id,
                          groupId: item.id,
                        }).unwrap()
                      }
                      key={index}
                      variant={
                        course.groupCourses
                          ?.map((groupCourse) => groupCourse.group.id)
                          .includes(item.id)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                    >
                      {item?.name}
                    </Button>
                  ))}
                  {classData.length === 0 && <p>-</p>}
                </div>
                <div className="text-muted-foreground mb-3 flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course._count?.enrollCourses ?? 0}</span>
                  </div>

                  <Badge variant="secondary" className="text-xs">
                    {course.status}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {course.groupCourses?.map((groupCourse) => (
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        key={groupCourse.group.id}
                      >
                        {groupCourse.group.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p>{course.description}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No courses found for this group.</p>
        )}
      </div>
    </div>
  );
}
