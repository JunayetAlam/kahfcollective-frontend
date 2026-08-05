"use client";

import Loading from "@/components/Global/Loading";
import NoDataFound from "@/components/Global/NoDataFound";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetCourseByIdQuery } from "@/redux/api/courseApi";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ContentTab } from "./ContentTab";
import { StudentsTab } from "./StudentsTab";

export default function CourseManageDetails({ courseId }: { courseId: string }) {
  const { data, isLoading } = useGetCourseByIdQuery(courseId);
  const courseData = data?.data;

  if (isLoading) {
    return <Loading />;
  }

  if (!courseData) {
    return <NoDataFound />;
  }

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/my-courses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{courseData.title}</h1>
          <p className="text-muted-foreground text-sm">
            Manage course content and student performance
          </p>
        </div>
      </div>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="students">Students & Ranking</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="mt-4">
          <ContentTab courseData={courseData} />
        </TabsContent>
        <TabsContent value="students" className="mt-4">
          <StudentsTab courseId={courseId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
