"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { T_Course } from "@/types";
import { Trash2 } from "lucide-react";
import { MF_AddContentButton } from "./MC_Button";

interface ContentTabProps {
  setOpen: (s: boolean) => void;
  courseData: T_Course;
}

export function ContentTab({ setOpen, courseData }: ContentTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Manage Course Content</h3>
      <MF_AddContentButton courseData={courseData} />
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
          {courseData?.courseContents.map((item, idx) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.type}</TableCell>
              <TableCell>
                <Badge variant="secondary">{item.status}</Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={item.status === "PUBLISHED" ? "default" : "outline"}
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {/* <MF_EditContentBuMF_CONtton content={courseData} /> */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log(item.status)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 border-t pt-4">
        <Button onClick={() => setOpen(false)} variant="outline">
          Cancel
        </Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
