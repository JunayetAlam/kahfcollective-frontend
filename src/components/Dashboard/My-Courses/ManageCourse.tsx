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

export default function ManageCourse({ courseId }: { courseId: string }) {
  const [open, setOpen] = useState(false);

  const { data: courseData } = useGetCourseByIdQuery(courseId);
  if(!courseData?.data){
    return  ''
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Manage Course: Principles of Adab</DialogTitle>
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
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
