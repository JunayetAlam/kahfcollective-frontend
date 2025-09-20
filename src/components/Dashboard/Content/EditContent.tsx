"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { Upload } from "lucide-react";

import { Option, SearchableSelect } from "@/components/ui/SearchableSelect";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetContentByIdQuery,
  useUpdateContentMutation,
} from "@/redux/api/contentApi";
import { useGetAllTiersQuery } from "@/redux/api/tierApi";
import { useGetAllUsersQuery } from "@/redux/api/userApi";

// -------- Schema --------
const updateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Content/Description is required"),
  tierId: z.string().min(1, "Tier is required"),
  authorId: z.string().min(1, "Author is required"),
  file: z.any().optional(),
});
type UpdateFormValues = z.infer<typeof updateSchema>;

export default function EditContent({ contentId }: { contentId: string }) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const { data: contentData, isFetching } = useGetContentByIdQuery(contentId);
  const { data: usersData } = useGetAllUsersQuery([]);
  const { data: tiersData } = useGetAllTiersQuery([]);

  const userOptions: Option[] =
    usersData?.data?.map((u: any) => ({ id: u.id, name: u.fullName })) || [];
  const tierOptions: Option[] =
    tiersData?.data?.map((t: any) => ({ id: t.id, name: t.name })) || [];

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      title: "",
      description: "",
      tierId: "",
      authorId: "",
      file: null,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = form;
  const selectedFile = watch("file");

  // Prefill form when contentData is fetched
  useEffect(() => {
    if (contentData?.data) {
      const content = contentData.data;
      reset({
        title: content.title || "",
        description: content.description || "",
        tierId: content.tierId || "",
        authorId: content.authorId || "",
        file: null,
      });
      if (content.thumbnail) setPreview(content.thumbnail);
    }
  }, [contentData, reset]);

  // Update preview when file changes
  useEffect(() => {
    if (
      selectedFile instanceof File &&
      selectedFile.type.startsWith("image/")
    ) {
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [selectedFile]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setValue("file", e.target.files[0]);
  };

  const [updateContent, { isLoading }] = useUpdateContentMutation();

  const onSubmit = async (values: UpdateFormValues) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("tierId", values.tierId);
      formData.append("authorId", values.authorId);
      if (values.file) formData.append("content", values.file);

      await updateContent({ id: contentId, data: formData }).unwrap();
      toast.success("✅ Content updated successfully!");
      setOpen(false);
      reset();
      setPreview(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "❌ Failed to update content");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          reset();
          setPreview(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Content</DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <p className="py-6 text-center">Loading content...</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
            {/* Title */}
            <div>
              <Label>Title</Label>
              <Input {...register("title")} placeholder="Enter title" />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Author */}
            <SearchableSelect
              label="Author / Speaker"
              options={userOptions}
              value={watch("authorId")}
              onChange={(val) => setValue("authorId", val)}
              placeholder="Search author..."
            />
            {errors.authorId && (
              <p className="text-sm text-red-500">{errors.authorId.message}</p>
            )}

            {/* Tier */}
            <SearchableSelect
              label="Tier"
              options={tierOptions}
              value={watch("tierId")}
              onChange={(val) => setValue("tierId", val)}
              placeholder="Search tier..."
            />
            {errors.tierId && (
              <p className="text-sm text-red-500">{errors.tierId.message}</p>
            )}

            {/* Content / Description */}
            <div>
              <Label>Content / Description</Label>
              <Textarea
                {...register("description")}
                placeholder="Enter content or description"
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <Label>Upload File (Optional)</Label>
              <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 text-center hover:border-gray-300">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={onFileChange}
                  accept="image/*,audio/*,video/*"
                />
                <label
                  htmlFor="file-upload"
                  className="flex cursor-pointer flex-col items-center space-y-2"
                >
                  {!preview ? (
                    <>
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">
                        Click to upload file
                      </span>
                      <span className="text-xs text-gray-400">
                        Images, Audio, or Video
                      </span>
                    </>
                  ) : (
                    <img
                      src={preview}
                      alt="preview"
                      className="max-h-48 rounded-md object-contain"
                    />
                  )}
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
