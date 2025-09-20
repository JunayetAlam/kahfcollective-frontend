import CustomInput from "@/components/Forms/CustomInput";
import CustomSelect from "@/components/Forms/CustomSelect";
import CustomTextarea from "@/components/Forms/CustomTextarea";
import { Upload } from "lucide-react";

export default function ContentForm() {
  return (
    <div className="space-y-6">
      {/* Content Type */}
      <CustomSelect
        required
        name="contentType"
        label="Content Type"
        placeholder="Select content type"
        options={[
          { value: "ARTICLE", label: "Article" },
          { value: "SERMONS", label: "Sermons" },
        ]}
      />

      {/* Title */}
      <CustomInput
        required
        name="title"
        type="text"
        label="Title"
        placeholder="Enter article title"
      />

      {/* Author */}
      <CustomInput
        required
        name="author"
        type="text"
        label="Author"
        placeholder="e.g. Dr. Jenny"
      />

      {/* Content */}
      <CustomTextarea
        required
        name="content"
        label="Content"
        placeholder="Write the article content here..."
        rows={6}
      />

      {/* Tags */}
      <CustomSelect
        name="tags"
        label="Tags"
        placeholder="Select a tag"
        options={[
          { value: "technology", label: "Technology" },
          { value: "health", label: "Health" },
          { value: "business", label: "Business" },
          { value: "education", label: "Education" },
          { value: "lifestyle", label: "Lifestyle" },
        ]}
      />

      {/* Cover Image Upload */}
      <div className="space-y-2">
        <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Cover Image
        </label>
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center transition-colors hover:border-gray-300">
          <input
            type="file"
            id="cover-image"
            className="hidden"
            accept="image/*"
            // You would need to handle file uploads with react-hook-form
            // This is a simplified version
          />
          <label
            htmlFor="cover-image"
            className="flex cursor-pointer flex-col items-center space-y-2"
          >
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">
              Click to upload file
            </span>
            <span className="text-xs text-gray-400">
              PNG, JPG, GIF up to 10MB
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
