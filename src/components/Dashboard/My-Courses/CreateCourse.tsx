/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCreateCourseMutation } from "@/redux/api/courseApi";
import { useGetAllTiersQuery } from "@/redux/api/tierApi";

// -------------------- Zod Schema --------------------
const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tierId: z.string().min(1, "Tier is required"),
  language: z.string().min(1, "Language is required"),
  status: z.enum(["DRAFT", "ACTIVE", "HIDDEN"], "Status is required"),
});

type CourseFormValues = z.infer<typeof courseSchema>;

// ------------------- Component -------------------
export default function CreateCourse() {
  const [open, setOpen] = useState(false);
  const [createCourse] = useCreateCourseMutation();

  const { data: tiersData } = useGetAllTiersQuery([]);
  const tierOptions = tiersData?.data || [];

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      tierId: "",
      language: "",
      status: "" as "ACTIVE",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const onSubmit = async (data: any) => {
    try {
      await createCourse(data).unwrap();
      toast.success("✅ Course created successfully!");
      setOpen(false);
      reset();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "❌ Something went wrong!");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>Create new Course</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
          <p className="text-sm text-gray-600">
            Add a new course to your curriculum.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input {...form.register("title")} placeholder="Course title" />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Input
              {...form.register("description")}
              placeholder="Course description"
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Tier */}
          <Controller
            control={control}
            name="tierId"
            render={({ field }) => (
              <div>
                <Label>Tier</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {tierOptions.map((tier: any) => (
                      <SelectItem key={tier.id} value={tier.id}>
                        {tier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tierId && (
                  <p className="text-sm text-red-500">
                    {errors.tierId.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Language */}
          <div>
            <Label>Language</Label>
            <Input
              {...form.register("language")}
              placeholder="Course language"
            />
            {errors.language && (
              <p className="text-sm text-red-500">{errors.language.message}</p>
            )}
          </div>

          {/* Status */}
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <div>
                <Label>Status</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="DRAFT">Draft</SelectItem> */}
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="HIDDEN">Hidden</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-500">
                    {errors.status.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating Course...
                </>
              ) : (
                "Create Course"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}