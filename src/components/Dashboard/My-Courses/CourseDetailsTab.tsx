"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CourseData } from "@/types";

interface CourseDetailsTabProps {
  courseData: CourseData;
}

export function CourseDetailsTab({ 
  courseData, 
}: CourseDetailsTabProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Course Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Course Title</Label>
          <Input
            id="title"
            value={courseData.title}
            onChange={(e) => console.log("title", e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={courseData.description}
            onChange={(e) => console.log("description", e.target.value)}
            rows={6}
          />
        </div>

        {/* Tier Level and Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tier Level</Label>
            <Select 
              value={courseData.tierLevel} 
              onValueChange={(value) => console.log("tierLevel", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Awaken">Awaken</SelectItem>
                <SelectItem value="Ascend">Ascend</SelectItem>
                <SelectItem value="Actualize">Actualize</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              value={courseData.status} 
              onValueChange={(value) => console.log("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="outline" >
          Cancel
        </Button>
        <Button>
          Save Changes
        </Button>
      </div>
    </div>
  );
}