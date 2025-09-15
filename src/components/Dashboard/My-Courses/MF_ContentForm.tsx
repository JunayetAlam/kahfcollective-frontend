/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { ContentDetailsForm } from "./ContentDetailsForm";
import { ContentCreationForm } from "./ContentCreationForm";
import { CourseContentData, ContentFormProps } from "@/types";

export function MF_ContentForm({ isEdit = false, existingContent = null, trigger = null }: ContentFormProps) {
  const [open, setOpen] = useState(false);
  const [contentData, setContentData] = useState<CourseContentData>({
    title: existingContent?.title || "",
    description: existingContent?.description || "",
    type: existingContent?.type || "",
    status: existingContent?.status || "Draft",
    videoFile: existingContent?.videoFile || null,
    questions: existingContent?.questions || [],
  });

  const handleInputChange = (field: keyof CourseContentData, value: any) => {
    setContentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Validate form
    if (!contentData.title || !contentData.type) {
      alert("Please fill in the required fields");
      return;
    }

    if (contentData.type === "quiz" && contentData.questions.length === 0) {
      alert("Please add at least one question for the quiz");
      return;
    }

    if (contentData.type === "video" && !contentData.videoFile) {
      alert("Please upload a video file");
      return;
    }

    console.log("Saving content:", contentData);
    // Here you would make API call to save/update content
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    // Reset form if adding new content
    if (!isEdit) {
      setContentData({
        title: "",
        description: "",
        type: "",
        status: "Draft",
        videoFile: null,
        questions: [],
      });
    }
  };

  const defaultTrigger = (
    <Button size="sm">
      <Plus className="w-4 h-4 mr-2" />
      Add Content
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Content" : "Add New Content"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {isEdit 
              ? "Update the content details and materials" 
              : "Create new video or quiz content for your course"
            }
          </p>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="content">
              {contentData.type === "video" ? "Video" : contentData.type === "quiz" ? "Quiz" : "Content"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4 overflow-y-auto max-h-[60vh]">
            <ContentDetailsForm 
              contentData={contentData}
              onInputChange={handleInputChange}
            />
          </TabsContent>

          <TabsContent value="content" className="mt-4 space-y-4 overflow-y-auto max-h-[60vh]">
            <ContentCreationForm 
              contentData={contentData}
              onInputChange={handleInputChange}
            />
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isEdit ? "Save Changes" : "Create Content"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}