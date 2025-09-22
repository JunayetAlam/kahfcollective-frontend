/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { CourseContentData } from "@/types";
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

export function MF_AddContentButton({ courseData }: any) {
  console.log({ aaaaa: courseData });
  return <MF_ContentForm courseData={courseData} />;
}
