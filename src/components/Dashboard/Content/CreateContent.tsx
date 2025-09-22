/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import { Option, SearchableSelect } from "@/components/ui/SearchableSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";

import { useCreateNewContentMutation } from "@/redux/api/contentApi";
import { useGetAllTiersQuery } from "@/redux/api/tierApi";
import { useGetAllUsersQuery } from "@/redux/api/userApi";
import Image from "next/image";

// ------------------------- Zod Schema -------------------------
const contentSchema = z.object({
  contentType: z.enum(["ARTICLE", "SERMONS"], {
    message: "Content type is required",
  }),
  title: z.string().min(1, "Title is required"),
  authorId: z.string().min(1, "Author is required"),
  contentOrDescriptor: z.string().min(1, "Content/Description is required"),
  tierId: z.string().min(1, "Tier is required"),
  content: z.any().optional(),
  thumbnail: z.any().optional(),
});

type ContentFormValues = z.infer<typeof contentSchema>;

// --------------------- Main Component -----------------------
export default function CreateContent() {
  const [open, setOpen] = useState(false);

  const [createNewContent, { isLoading: isSubmitting }] =
    useCreateNewContentMutation();

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      contentType: "" as "ARTICLE",
      title: "",
      authorId: "",
      tierId: "",
      contentOrDescriptor: "",
      content: null,
      thumbnail: null,
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  const selectedContentType = watch("contentType");

  // Fetch users & tiers
  const { data: usersData } = useGetAllUsersQuery([]);
  const { data: tiersData } = useGetAllTiersQuery([]);

  const userOptions: Option[] =
    usersData?.data?.map((u) => ({ id: u.id, name: u.fullName })) || [];
  const tierOptions: Option[] =
    tiersData?.data?.map((t) => ({ id: t.id, name: t.name })) || [];

  // ---------------- File Change Handlers ----------------
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setValue("content", e.target.files[0]);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setValue("thumbnail", e.target.files[0]);
  };

  // ------------------- Submit Handler -------------------
  const onSubmit = async (data: ContentFormValues) => {
    if (selectedContentType === "SERMONS" && !data.content) {
      toast.error("❌ Please upload the audio/video file.");
      return;
    }
    if (selectedContentType === "ARTICLE" && !data.thumbnail) {
      toast.error("❌ Please upload the thumbnail image.");
      return;
    }

    const formData = new FormData();
    formData.append("contentType", data.contentType);
    formData.append("title", data.title);
    formData.append("authorId", data.authorId);
    formData.append("description", data.contentOrDescriptor);
    formData.append("tierId", data.tierId);

    if (selectedContentType === "SERMONS") {
      formData.append("content", data.content!);
    } else {
      formData.append("thumbnail", data.thumbnail!);
    }

    try {
      await createNewContent(formData).unwrap();
      toast.success("✅ Content published successfully!");
      setOpen(false);
      reset();
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.data?.message || "❌ Something went wrong. Please try again.",
      );
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
        <Button disabled={isSubmitting}>Create Content</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Content</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Content Type */}
          <Controller
            control={form.control}
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

          {/* Content/Description */}
          <div>
            <Label>Content / Description</Label>
            <Input
              {...form.register("contentOrDescriptor")}
              placeholder="Enter description or content"
            />
            {errors.contentOrDescriptor && (
              <p className="text-sm text-red-500">
                {errors.contentOrDescriptor.message}
              </p>
            )}
          </div>

          {/* File Upload */}
          {selectedContentType === "SERMONS" ? (
            <FileUpload
              label="Upload Video / Audio"
              value={watch("content")}
              onChange={handleContentChange}
              accept="video/*,audio/*"
            />
          ) : (
            <FileUpload
              label="Upload Thumbnail"
              value={watch("thumbnail")}
              onChange={handleThumbnailChange}
              accept="image/*"
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ------------------ Reusable File Upload ------------------
type FileUploadProps = {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: File | null;
  accept?: string;
};

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  onChange,
  value,
  accept,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const inputId = `file-upload-${label.replace(/\s+/g, "-").toLowerCase()}`;

  useEffect(() => {
    if (!value) return setPreview(null);

    // Image preview
    if (value instanceof File && value.type.startsWith("image/")) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }

    // For audio/video, show filename instead
    if (
      value instanceof File &&
      (value.type.startsWith("audio/") || value.type.startsWith("video/"))
    ) {
      setPreview(value.name);
    }
  }, [value]);

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
          ) : value instanceof File && value.type.startsWith("image/") ? (
            <div className="w-full aspect-video relative">
              <Image
                src={preview}
                alt="image"
                fill
                className="object-cover"
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
