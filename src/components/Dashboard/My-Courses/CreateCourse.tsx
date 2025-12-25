/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import CustomForm from "@/components/Forms/CustomForm";
import CustomInput from "@/components/Forms/CustomInput";
import CustomSelect from "@/components/Forms/CustomSelect";
import CustomComboBoxMultiple from "@/components/Forms/CustomComboBoxMultiple";

import { useCreateCourseMutation } from "@/redux/api/courseApi";
import { useGetAllUsersQuery } from "@/redux/api/userApi";
import Spinner from "@/components/Global/Spinner";

// -------------------- Default Values --------------------
const defaultValues = {
  title: "",
  description: "",
  instructorId: "",
  language: "",
  status: "ACTIVE",
};

// -------------------- Component --------------------
export default function CreateCourse() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [createCourse, { isLoading }] = useCreateCourseMutation();

  const {
    data: userData,
    isLoading: isUserLoading,
    isError,
  } = useGetAllUsersQuery([{ name: "searchTerm", value: searchTerm }]);

  const instructorOptions = userData?.data || [];
  console.log("instructorOptions", instructorOptions);
  const handleSave = async (data: any) => {
    const toastId = toast.loading("Creating course...");
    try {
      await createCourse(data).unwrap();
      toast.success("Course created successfully", { id: toastId });
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create course", {
        id: toastId,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create new Course</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
          <p className="text-muted-foreground text-sm">
            Add a new course to your curriculum.
          </p>
        </DialogHeader>

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
            label="Title"
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
              {isLoading ? <Spinner /> : "Create Course"}
            </Button>
          </div>
        </CustomForm>
      </DialogContent>
    </Dialog>
  );
}
