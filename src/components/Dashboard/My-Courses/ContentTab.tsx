"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { MF_AddContentButton, MF_EditContentButton } from "./MC_Button";
import { CourseContentData } from "@/types";

interface ContentTabProps {
  contentItems: CourseContentData[];
}

export function ContentTab({
  contentItems,
}: ContentTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Manage Course Content</h3>
      <MF_AddContentButton />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contentItems.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={item.status === "Published" ? "default" : "outline"}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <MF_EditContentButton content={item}  />
                  <Button variant="ghost" size="sm" onClick={() => console.log(item.title)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="outline">
          Cancel
        </Button>
        <Button>
          Save Changes
        </Button>
      </div>
    </div>
  );
}