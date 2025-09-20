"use client";

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
import { ContentDetailsFormProps } from "@/types";

export function ContentDetailsForm({
  contentData,
  onInputChange,
}: ContentDetailsFormProps) {
  return (
    <div className="space-y-4">
      {/* Content Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Content Title</Label>
        <Input
          id="title"
          value={contentData.title}
          onChange={(e) => onInputChange("title", e.target.value)}
          placeholder="Enter content title"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={contentData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          placeholder="Describe the content and learning objectives"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Content Type */}
        <div className="space-y-2">
          <Label>Content Type</Label>
          <Select
            value={contentData.type}
            onValueChange={(value) => onInputChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="quiz">Quiz</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={contentData.status}
            onValueChange={(value) => onInputChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
