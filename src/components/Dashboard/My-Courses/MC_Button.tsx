/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Course, CourseContentData } from "@/types";
import { Edit } from "lucide-react";
import { MF_ContentForm } from "./MF_ContentForm";

export function MF_EditContentButton({
  content,
}: {
  content: CourseContentData;
}) {
  return (
    <MF_ContentForm
      isEdit={true}
      existingContent={content}
      trigger={
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      }
    />
  );
}

export function MF_AddContentButton({
  courseData,
  semesterId,
  chapterId,
  scopeLabel,
  trigger,
}: {
  courseData: Course;
  semesterId?: string | null;
  chapterId?: string | null;
  scopeLabel?: string;
  trigger?: React.ReactNode;
}) {
  return (
    <MF_ContentForm
      courseData={courseData}
      semesterId={semesterId}
      chapterId={chapterId}
      scopeLabel={scopeLabel}
      trigger={trigger}
    />
  );
}
