"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";
import { useGetAllTiersQuery } from "@/redux/api/tierApi";
import { TQueryParam } from "@/types";
import { Search, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import CreateCourse from "./CreateCourse";
import ManageCourse from "./ManageCourse";

export default function CourseManagementDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const tierId = searchParams?.get("tierId") || "";

  const { data: tiers } = useGetAllTiersQuery([]);
  const queryFilter: TQueryParam[] = tierId
    ? [{ name: "tierId", value: tierId }]
    : [];

  const { data: courses, isLoading } = useGetAllCoursesQuery(queryFilter);

  const handleSetUrl = useCallback(
    (selectedTierId: string) => {
      const params = new URLSearchParams(searchParams as any);
      if (selectedTierId === "all") params.delete("tierId");
      else params.set("tierId", selectedTierId);
      router.replace(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  const filteredCourses = useMemo(() => {
    if (!courses?.data) return [];
    return courses.data.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [courses, searchTerm]);

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
        <h1 className="text-2xl font-bold">My Courses</h1>
        <CreateCourse />
      </div>

      {/* Tier Buttons */}
      <div className="bg-card flex w-fit flex-wrap items-center gap-1.5 rounded-md border p-2 py-1">
        <Button
          size="sm"
          variant={!tierId ? "default" : "outline"}
          onClick={() => handleSetUrl("all")}
          className="h-8"
        >
          All
        </Button>

        {tiers?.data?.map((tier) => (
          <Button
            key={tier.id}
            size="sm"
            variant={tierId === tier.id ? "default" : "outline"}
            onClick={() => handleSetUrl(tier.id)}
          >
            {tier.name}
          </Button>
        ))}
      </div>

      {/* Course Cards */}
      <div className="mt-6 space-y-3">
        {isLoading ? (
          <p>Loading courses...</p>
        ) : filteredCourses.length ? (
          filteredCourses.map((course) => (
            <Card key={course.id} className="w-full">
              <CardHeader className="flex items-center justify-between pb-4">
                <CardTitle className="text-lg font-semibold">
                  {course.title}
                </CardTitle>
                <ManageCourse courseId={course.id} />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-muted-foreground mb-3 flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course._count?.courseContents || 0}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {course.status}
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
