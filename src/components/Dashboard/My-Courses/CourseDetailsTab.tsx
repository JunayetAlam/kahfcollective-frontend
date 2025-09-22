/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateCourseMutation } from "@/redux/api/courseApi";
import { Course } from "@/types";
import { toast } from "sonner";

interface CourseDetailsTabProps {
  courseData: Course;
  setOpen: (s: boolean) => void;
}

const courseSchema = z.object({
  title: z.string().min(1, "Title must be at least 1 characters"),
  description: z.string().min(1, "Description must be at least 1 characters"),
  status: z.enum(["ACTIVE", "HIDDEN"]),
  language: z.string().min(2, "Language must be at least 2 characters"),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export function CourseDetailsTab({
  courseData,
  setOpen,
}: CourseDetailsTabProps) {

  const [updateCourse, { isLoading }] = useUpdateCourseMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,

    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: courseData.title,
      description: courseData.description || "",
      status: courseData.status as "ACTIVE",
      language: courseData.language || "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await updateCourse({ id: courseData.id, data }).unwrap(); // wrap fields in data
      toast.success("Course updated successfully");
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Update failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Course Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Course Title</Label>
          <Input id="title" {...register("title")} />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={6} {...register("description")} />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Tier, Status, Language */}
        <div className="grid grid-cols-2 gap-4">
         

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={watch("status")}
              onValueChange={(val) =>
                setValue("status", val as "ACTIVE" | "HIDDEN")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="HIDDEN">Hidden</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Input
              id="language"
              {...register("language")}
              placeholder="e.g. English"
            />
            {errors.language && (
              <p className="text-sm text-red-500">{errors.language.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 border-t pt-4">
        <Button variant="outline" type="button" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
