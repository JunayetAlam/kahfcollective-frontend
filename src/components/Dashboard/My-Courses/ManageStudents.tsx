"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/Global/Pagination";
import TableSkeleton from "@/components/Global/TableSkeleton";
import {
  useGetAllGroupUsersQuery,
  useGetAllMultipleGroupUsersQuery,
} from "@/redux/api/userApi";
import { useSearchParams } from "next/navigation";
import { TQueryParam, User } from "@/types";
import { Search, UserCog, Users } from "lucide-react";
import Image from "next/image";

import defaultImg from "@/assets/user.png";
import { useToggleEnrollCourseMutation } from "@/redux/api/courseApi";

// ---------------- Search Component ----------------
function SearchStudents() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams?.get("searchTerm") || "",
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (searchTerm) {
      params.set("searchTerm", searchTerm);
    } else {
      params.delete("searchTerm");
    }
    params.set("page", "1"); // Reset to first page on search
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64 pl-9"
        />
      </div>
      <Button type="submit" variant="outline" size="sm">
        Search
      </Button>
    </form>
  );
}

// ---------------- Student Row Component ----------------
function StudentRow({
  student,
  courseId,
}: {
  student: User;
  courseId: string;
}) {
  const isAssignedToTheCourse = student?.enrollCourses
    ?.map((item) => item?.courseId)
    ?.includes(courseId);

  const [toggleEnrollCourse, { isLoading }] = useToggleEnrollCourseMutation();

  const handleToggleAssignment = async () => {
    try {
      await toggleEnrollCourse({
        courseId,
        userId: student?.id,
      })?.unwrap();
    } catch (error) {
      console.error("Failed to toggle assignment:", error);
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="relative aspect-square w-14 overflow-hidden rounded-full border">
            <Image
              src={student?.profile || defaultImg}
              alt="image"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{student?.fullName}</div>
            <div className="text-muted-foreground text-sm">
              {student?.email}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant={isAssignedToTheCourse ? "default" : "secondary"}>
              {isAssignedToTheCourse ? "Assigned" : "Not Assigned"}
            </Badge>
          </div>
          <Switch
            checked={isAssignedToTheCourse || false}
            onCheckedChange={handleToggleAssignment}
            disabled={isLoading}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

// ---------------- Main Component ----------------
export default function ManageStudents({
  groupIds,
  courseId,
}: {
  groupIds: string[];
  courseId: string;
}) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  const page = searchParams?.get("page") || "";
  const searchTerm = searchParams?.get("searchTerm") || "";

  const queryFilter: TQueryParam[] = [
    { name: "page", value: page },
    { name: "searchTerm", value: searchTerm },
  ]?.filter((item) => item?.value);

  const { data, isLoading, error } =
    useGetAllMultipleGroupUsersQuery({ args: queryFilter, groupIds }) || {};

  const students = data?.data || [];
  console.log(students);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserCog className="h-4 w-4" />
          Students
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Students</DialogTitle>
          <p className="text-muted-foreground text-sm">
            Assign or unassign students to courses and manage their access.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header with Search */}
          <div className="border-border flex items-center justify-between border-b pb-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold">Students</h2>
              <Badge variant="outline">{data?.meta?.total || 0} Total</Badge>
            </div>
            <SearchStudents />
          </div>

          {/* Table */}
          <div className="">
            {isLoading ? (
              <TableSkeleton headers={["Student", "Assignment Status"]} />
            ) : error ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Failed to load students</p>
              </div>
            ) : students?.length === 0 ? (
              <div className="py-8 text-center">
                <Users className="text-muted-foreground/50 mx-auto h-12 w-12" />
                <p className="text-muted-foreground mt-2">No students found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-right">
                      Assignment Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody colSpan={2}>
                  {students?.map((student: User) => (
                    <StudentRow
                      key={student?.id}
                      student={student}
                      courseId={courseId}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && !error && students?.length > 0 && (
            <div className="border-t pt-4">
              <Pagination totalPages={data?.meta?.totalPage || 1} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
