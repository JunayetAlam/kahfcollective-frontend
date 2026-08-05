"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetCourseByIdQuery } from "@/redux/api/courseApi";
import { useState } from "react";
import { CourseDetailsTab } from "./CourseDetailsTab";
import Loading from "@/components/Global/Loading";
import NoDataFound from "@/components/Global/NoDataFound";
import { Edit } from "lucide-react";

export default function ManageCourse({ courseId }: { courseId: string }) {
  const [fetchData, setFetchData] = useState(false);
  const [open, setOpen] = useState(false);

  const { data: courseData, isLoading } = useGetCourseByIdQuery(courseId, {
    skip: !fetchData,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setFetchData(true)}
          variant="outline"
          size="icon"
        >
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Course: {courseData?.data?.title}</DialogTitle>
          <p className="text-muted-foreground text-sm">
            Update course details and status.
          </p>
        </DialogHeader>

        {isLoading ? (
          <Loading />
        ) : !courseData?.data ? (
          <NoDataFound />
        ) : (
          <CourseDetailsTab
            courseData={courseData.data}
            setOpen={(open) => setOpen(open)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
