"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetEnrolledStudentsQuery } from "@/redux/api/courseApi";
import { CourseEnroll } from "@/types";

export function StudentsTab({ courseId }: { courseId: string }) {
  const { data: students } = useGetEnrolledStudentsQuery(courseId);

  console.log({ students });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Enrolled Students</h3>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Last Access</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students?.length ? (
            students?.map((student: CourseEnroll) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">
                  {student.user.fullName}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <div className="mx-auto py-3">Not list found</div>
          )}
        </TableBody>
      </Table>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 border-t pt-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
