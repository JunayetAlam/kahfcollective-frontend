/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CustomForm from "@/components/Forms/CustomForm";
import CustomInput from "@/components/Forms/CustomInput";
import CustomSelect from "@/components/Forms/CustomSelect";
import CustomComboBoxMultiple from "@/components/Forms/CustomComboBoxMultiple";

import { useUpdateCourseMutation } from "@/redux/api/courseApi";
import { useGetAllUsersQuery } from "@/redux/api/userApi";
import Spinner from "@/components/Global/Spinner";

import { Course } from "@/types";

interface CourseDetailsTabProps {
  courseData: Course;
  setOpen: (s: boolean) => void;
}

export function CourseDetailsTab({ courseData, setOpen }: CourseDetailsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const [updateCourse, { isLoading }] = useUpdateCourseMutation();

  const {
    data: userData,
    isLoading: isUserLoading,
    isError,
  } = useGetAllUsersQuery([{ name: "searchTerm", value: searchTerm }]);

  const instructorOptions = userData?.data || [];

  const defaultValues = {
    title: courseData.title || "",
    description: courseData.description || "",
    instructorId: courseData.instructorId || "",
    language: courseData.language || "",
    status: courseData.status || "ACTIVE",
  };

  const handleSave = async (data: any) => {
    const toastId = toast.loading("Updating course...");
    try {
      await updateCourse({ id: courseData.id, data }).unwrap();
      toast.success("Course updated successfully", { id: toastId });
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Update failed", { id: toastId });
    }
  };
  console.log({ hello: courseData.instructorId, instructorOptions: instructorOptions.find((u: any) => u.id === courseData.instructorId) })
  return (
    <CustomForm
      onSubmit={handleSave}
      defaultValues={defaultValues}
      className="bg-background space-y-6 py-4"
    >
      {/* Title */}
      <CustomInput
        required
        type="text"
        name="title"
        label="Course Title"
        placeholder="Course title"
        disabled={isLoading}
      />

      {/* Description */}
      <CustomInput
        required
        type="text"
        name="description"
        label="Description"
        placeholder="Course description"
        disabled={isLoading}
      />

      {/* Instructor */}
      <CustomComboBoxMultiple
        name="instructorId"
        mode="single"
        label="Instructor"
        placeholder="Select Instructor"
        required
        options={instructorOptions.map((u: any) => ({
          value: u.id,
          name: u.fullName || "",
        }))}
        onSearchChange={setSearchTerm}
        emptyMessage="No instructor found"
        isLoading={isUserLoading}
        isError={isError}
        searchPlaceholder="Search instructor"
      />

      {/* Language */}
      <CustomInput
        required
        type="text"
        name="language"
        label="Language"
        placeholder="Course language"
        disabled={isLoading}
      />

      {/* Status */}
      <CustomSelect
        name="status"
        label="Status"
        placeholder="Select status"
        disabled={isLoading}
        options={[
          { label: "Active", value: "ACTIVE" },
          { label: "Hidden", value: "HIDDEN" },
        ]}
      />

      {/* Actions */}
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setOpen(false)}
          disabled={isLoading}
        >
          Cancel
        </Button>

        <Button size="sm" disabled={isLoading}>
          {isLoading ? <Spinner /> : "Save Changes"}
        </Button>
      </div>
    </CustomForm>
  );
}
