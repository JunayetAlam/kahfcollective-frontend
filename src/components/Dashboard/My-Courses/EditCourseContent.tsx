"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// adjust path
import {
  useGetAllQuizzesForCourseQuery,
  useUpdateCourseContentMutation,
  useUpdateVideoMutationMutation,
} from "@/redux/api/courseContent";
import * as z from "zod";

const editSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export default function EditContentForm({
  item,
  onClose,
}: {
  item: any;
  onClose: () => void;
}) {
  const [updateContent, { isLoading: isUpdating }] =
    useUpdateCourseContentMutation();
  const [updateVideo, { isLoading: isUploading }] =
    useUpdateVideoMutationMutation();
  const { data: quizzesData } = useGetAllQuizzesForCourseQuery(item?.id);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  console.log({ quizzesData });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: item.title,
      description: item.description,
      status: item.status,
    },
  });

  // Main form submit
  const onSubmit = async (data: any) => {
    try {
      await updateContent({ id: item.id, ...data }).unwrap();
      toast.success("Content updated successfully");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  // Video upload submit
  const handleVideoUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a video first");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("id", item.id);

      await updateVideo({ id: item.id, formData }).unwrap();
      toast.success("Video updated successfully");
      setSelectedFile(null); // reset input
    } catch (error: any) {
      toast.error(error?.data?.message || "Video upload failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Main content form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input placeholder="Title" {...register("title")} />
        {errors?.title && (
          <p className="text-sm text-red-500">
            {errors.title.message?.toString()}
          </p>
        )}

        <Textarea
          placeholder="Description"
          {...register("description")}
          rows={4}
        />
        {errors.description && (
          <p className="text-sm text-red-500">
            {errors.description.message?.toString()}
          </p>
        )}

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">DRAFT</SelectItem>
                <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      {/* Video upload form (separate) */}
      {item.type === "VIDEO" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Change Video</label>
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />
          {selectedFile && (
            <p className="text-sm">Selected: {selectedFile.name}</p>
          )}
          <Button onClick={handleVideoUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload Video"}
          </Button>
        </div>
      )}
    </div>
  );
}
