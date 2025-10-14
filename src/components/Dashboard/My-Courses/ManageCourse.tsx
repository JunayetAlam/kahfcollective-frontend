"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetCourseByIdQuery } from "@/redux/api/courseApi";
import { useState } from "react";
import { ContentTab } from "./ContentTab";
import { CourseDetailsTab } from "./CourseDetailsTab";
import Loading from "@/components/Global/Loading";
import NoDataFound from "@/components/Global/NoDataFound";

export default function ManageCourse({ courseId }: { courseId: string }) {
  const [fetchData, setFetchData] = useState(false);
  const [open, setOpen] = useState(false);

  const { data: courseData, isLoading } = useGetCourseByIdQuery(courseId, { skip: !fetchData });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setFetchData(true)} variant="outline" size="sm">
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Manage Course: {courseData?.data?.title}</DialogTitle>
          <p className="text-muted-foreground text-sm">
            Edit course details, manage content, and track student progress.
          </p>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          {
            isLoading ? <Loading /> : <>
              {!courseData?.data ? <NoDataFound /> : <>
                <TabsContent value="details" className="mt-6">
                  <CourseDetailsTab
                    courseData={courseData?.data}
                    setOpen={(open) => setOpen(open)}
                  />
                </TabsContent>

                {/* Content Tab */}
                <TabsContent value="content" className="mt-6">
                  <ContentTab
                    courseData={courseData?.data}
                    setOpen={(open) => setOpen(open)}
                  />
                </TabsContent>
              </>}
            </>
          }
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
