"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { CourseContentData } from "@/types";
import { MF_ContentForm } from "./MF_ContentForm";

export function MF_EditContentButton({ content }: { content: CourseContentData }) {
  return (
    <MF_ContentForm 
      isEdit={true}
      existingContent={content}
      trigger={
        <Button variant="ghost" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
      }
    />
  );
}

export function MF_AddContentButton() {
  return <MF_ContentForm />;
}
