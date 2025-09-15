import CustomInput from '@/components/Forms/CustomInput';
import CustomSelect from '@/components/Forms/CustomSelect';
import CustomTextarea from '@/components/Forms/CustomTextarea';
import { Upload } from 'lucide-react';
import React from 'react';

export default function ContentForm() {
  return (
    <div className='space-y-6'>
      {/* Content Type */}
      <CustomSelect
        required
        name="contentType"
        label="Content Type"
        placeholder="Select content type"
        options={[
          { value: "article", label: "Article" },
          { value: "blog", label: "Blog Post" },
          { value: "news", label: "News" },
          { value: "business", label: "Tutorial" },
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
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Cover Image
        </label>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-gray-300 transition-colors">
          <input
            type="file"
            id="cover-image"
            className="hidden"
            accept="image/*"
            // You would need to handle file uploads with react-hook-form
            // This is a simplified version
            onChange={(e) => {
              // Handle file upload logic here
            }}
          />
          <label
            htmlFor="cover-image"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <Upload className="w-8 h-8 text-gray-400" />
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