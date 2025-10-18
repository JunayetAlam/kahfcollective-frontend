/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import * as z from "zod";
import { toast } from "sonner";

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
import { Textarea } from "@/components/ui/textarea";
import { Option, SearchableSelect } from "@/components/ui/SearchableSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Upload } from "lucide-react";
import Image from "next/image";

import {
  useGetContentByIdQuery,
  useUpdateContentMutation,
} from "@/redux/api/contentApi";
import { useGetAllTiersQuery } from "@/redux/api/tierApi";
import { useGetAllUsersQuery } from "@/redux/api/userApi";

// ----------------- Zod Schema -----------------
const updateSchema = z.object({
  contentType: z.enum(["ARTICLE", "SERMONS"], {
    message: "Content type is required",
  }),
  title: z.string().min(1, "Title is required"),
  type: z.string().optional(),
  authorId: z.string().min(1, "Author is required"),
  description: z.string().min(1, "Description is required"),
  tierId: z.string().min(1, "Tier is required"),
  content: z.any().optional(),
  thumbnail: z.any().optional(),
});

type UpdateFormValues = z.infer<typeof updateSchema>;

// ----------------- Main Component -----------------
export default function EditContent({ contentId }: { contentId: string }) {
  const [open, setOpen] = useState(false);
  const [updateContent, { isLoading }] = useUpdateContentMutation();

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
      contentType: "" as "ARTICLE",
      title: "",
      type: "",
      authorId: "",
      description: "",
      tierId: "",
      content: null,
      thumbnail: null,
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = form;

  const selectedContentType = watch("contentType");

  // Prefill data
  useEffect(() => {
    if (contentData?.data) {
      const c = contentData.data;
      reset({
        contentType: c.contentType || "ARTICLE",
        title: c.title || "",
        type: c.type || "",
        authorId: c.authorId || "",
        tierId: c.tierId || "",
        description: c.description || "",
        content: null,
        thumbnail: null,
      });
    }
  }, [contentData, reset]);

  // File change handlers
  const handleFileChange = (field: "content" | "thumbnail") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) setValue(field, e.target.files[0]);
    };

  // Submit handler
  const onSubmit = async (data: UpdateFormValues) => {

    const formData = new FormData();
    formData.append("contentType", data.contentType);
    formData.append("title", data.title);
    formData.append("authorId", data.authorId);
    formData.append("description", data.description);
    formData.append("tierId", data.tierId);
    if (data.type) formData.append("type", data.type);
    if (selectedContentType === "SERMONS" && data.content)
      formData.append("content", data.content);
    if (selectedContentType === "ARTICLE" && data.thumbnail)
      formData.append("thumbnail", data.thumbnail);

    try {
      await updateContent({ id: contentId, data: formData }).unwrap();
      toast.success("✅ Content updated successfully!");
      setOpen(false);
      reset();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "❌ Failed to update content");
    }
  };
  const coverImg = contentData?.data?.coverImage || ''
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size={"icon"} ><Edit/></Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Content</DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <p className="py-6 text-center">Loading content...</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* Content Type */}
            <Controller
              control={control}
              name="contentType"
              render={({ field }) => (
                <div>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ARTICLE">Article</SelectItem>
                      <SelectItem value="SERMONS">Sermons</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.contentType && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.contentType.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Article type only for ARTICLE */}
            {selectedContentType === "ARTICLE" && (
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <div>
                    <Label>Article Type</Label>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select article type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="philosophy">Philosophy</SelectItem>
                        <SelectItem value="theology">Theology</SelectItem>
                        <SelectItem value="fiqh">Fiqh</SelectItem>
                        <SelectItem value="usool">Usool</SelectItem>
                        <SelectItem value="hadith">Hadith</SelectItem>
                        <SelectItem value="quran">Quran</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="politics">Politics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
            )}

            {/* Title */}
            <div>
              <Label>Title</Label>
              <Input {...form.register("title")} placeholder="Enter title" />
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

            {/* Description */}
            <div>
              <Label>Description / Content</Label>
              <Textarea
                {...form.register("description")}
                placeholder="Enter description"
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* File Upload */}
            {selectedContentType === "SERMONS" ? (
              <FileUpload
                label="Upload Video / Audio"
                value={watch("content")}
                onChange={handleFileChange("content")}
                accept="video/*,audio/*"
                contentType={watch("contentType")}
              />
            ) : (
              <FileUpload
                label="Upload Thumbnail"
                value={watch("thumbnail")}
                onChange={handleFileChange("thumbnail")}
                coverImg={coverImg}
                accept="image/*"
                contentType={watch("contentType")}
              />
            )}

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

// ---------------- Reusable File Upload ----------------
type FileUploadProps = {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: File | null;
  accept?: string;
  coverImg?: string
  contentType: string
};

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  onChange,
  value,
  accept,
  coverImg,
  contentType
}) => {
  const [preview, setPreview] = useState<string | null>(coverImg || null);
  const inputId = `file-upload-${label.replace(/\s+/g, "-").toLowerCase()}`;

  useEffect(() => {
    if (!value) return setPreview(coverImg || null);

    if (value instanceof File && value.type.startsWith("image/")) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }

    if (
      value instanceof File &&
      (value.type.startsWith("audio/") || value.type.startsWith("video/"))
    ) {
      setPreview(value.name);
    }
  }, [value, coverImg]);
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 text-center hover:border-gray-300">
        <input
          type="file"
          id={inputId}
          className="hidden"
          onChange={onChange}
          accept={accept}
        />
        <label
          htmlFor={inputId}
          className="flex cursor-pointer flex-col items-center space-y-2"
        >
          {!preview ? (
            <>
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">
                Click to upload file
              </span>
              <span className="text-xs text-gray-400">
                {label.toLowerCase().includes("thumbnail")
                  ? "PNG, JPG, GIF up to 10MB"
                  : "Video/Audio up to 500MB"}
              </span>
            </>
          ) : contentType === 'ARTICLE' ? (
            <div className="w-full aspect-video relative">
              <Image
                src={preview}
                alt="preview"
                fill
                className="object-cover rounded-md"
              />
            </div>
          ) : (
            <div className="text-sm font-medium text-gray-600">
              {preview} ✅
            </div>
          )}
        </label>
      </div>
    </div>
  );
};
