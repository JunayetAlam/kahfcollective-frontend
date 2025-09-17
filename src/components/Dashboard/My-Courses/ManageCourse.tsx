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
import { CourseDetailsTab } from "./CourseDetailsTab";
import { ContentTab } from "./ContentTab";
import { StudentsTab } from "./StudentsTab";
import { CourseContentData, CourseData, Student } from "@/types";

// Mock data for content and students
const courseContent: CourseContentData[] = [
  { 
    title: "Introduction to Adab", 
    description: "", 
    type: "video", 
    status: "Draft",
    videoFile: null,
    questions: []
  },
  { 
    title: "Quiz 1: Basic Principles", 
    description: "", 
    type: "Quiz", 
    status: "Published",
    videoFile: null,
    questions: []
  },
  { 
    title: "Advanced Adab Concepts", 
    description: "", 
    type: "video", 
    status: "Published",
    videoFile: null,
    questions: []
  },
  { 
    title: "Quiz 2: Application", 
    description: "", 
    type: "Quiz", 
    status: "Published",
    videoFile: null,
    questions: []
  },
  { 
    title: "Case Studies", 
    description: "", 
    type: "video", 
    status: "Draft",
    videoFile: null,
    questions: []
  },
];

const enrolledStudents: Student[] = [
  { id: 1, name: "Ahmad Hassan", progress: 75, lastAccess: "2 days ago" },
  { id: 2, name: "Fatima Ali", progress: 90, lastAccess: "Today" },
  { id: 3, name: "Mohammed Khan", progress: 60, lastAccess: "1 week ago" },
  { id: 4, name: "Sarah Johnson", progress: 45, lastAccess: "3 days ago" },
  { id: 5, name: "Abdullah Smith", progress: 100, lastAccess: "Yesterday" },
];

export default function ManageCourse() {
  const [open, setOpen] = useState(false);
  const [courseData, ] = useState<CourseData>({
    title: "Principles of Adab",
    description: "Learn the fundamental principles of Islamic etiquette and proper conduct in daily life.",
    tierLevel: "Awaken",
    status: "Active"
  });


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Manage Course: Principles of Adab</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Edit course details, manage content, and track student progress.
          </p>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="mt-6">
            <CourseDetailsTab
              courseData={courseData}
            />
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="mt-6">
            <ContentTab
              contentItems={courseContent}
            />
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="mt-6">
            <StudentsTab
              students={enrolledStudents}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}