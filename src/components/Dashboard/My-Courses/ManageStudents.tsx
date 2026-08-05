"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/Global/Pagination";
import TableSkeleton from "@/components/Global/TableSkeleton";
import { useGetAllMultipleGroupUsersQuery } from "@/redux/api/userApi";
import { useBulkEnrollCourseMutation } from "@/redux/api/courseApi";
import { TQueryParam, User } from "@/types";
import { Search, UserCog, Users } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import defaultImg from "@/assets/user.png";

type CourseClass = { id: string; name: string };

function isStudentAssigned(student: User, courseId: string) {
  return !!student?.enrollCourses?.some((item) => item?.courseId === courseId);
}

function SearchStudents({
  value,
  onSearch,
}: {
  value: string;
  onSearch: (term: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState(value);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
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

function StudentRow({
  student,
  selected,
  onToggleSelect,
  effectiveAssigned,
  isDirty,
  onToggleStatus,
}: {
  student: User;
  selected: boolean;
  onToggleSelect: (id: string, checked: boolean) => void;
  effectiveAssigned: boolean;
  isDirty: boolean;
  onToggleStatus: (id: string) => void;
}) {
  return (
    <TableRow className={isDirty ? "bg-muted/40" : undefined}>
      <TableCell>
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) =>
            onToggleSelect(student.id, checked === true)
          }
          aria-label={`Select ${student.fullName}`}
        />
      </TableCell>
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
        <div className="flex items-center justify-between gap-3">
          <Badge variant={effectiveAssigned ? "default" : "secondary"}>
            {effectiveAssigned ? "Assigned" : "Not Assigned"}
            {isDirty ? " *" : ""}
          </Badge>
          <Switch
            checked={effectiveAssigned}
            onCheckedChange={() => onToggleStatus(student.id)}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function ManageStudents({
  groups,
  courseId,
}: {
  groups: CourseClass[];
  courseId: string;
}) {
  const [open, setOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [initialAssigned, setInitialAssigned] = useState<
    Record<string, boolean>
  >({});
  const [pendingStatus, setPendingStatus] = useState<Record<string, boolean>>(
    {},
  );

  const groupIds = useMemo(() => {
    if (selectedGroupId === "all") return groups.map((g) => g.id);
    return [selectedGroupId];
  }, [groups, selectedGroupId]);

  const queryFilter: TQueryParam[] = [
    { name: "page", value: String(page) },
    { name: "searchTerm", value: searchTerm },
  ].filter((item) => item.value);

  const { data, isLoading, error, isFetching } =
    useGetAllMultipleGroupUsersQuery(
      { args: queryFilter, groupIds },
      { skip: !open || groupIds.length === 0 },
    );

  const students: User[] = data?.data || [];
  const [bulkEnroll, { isLoading: isSaving }] = useBulkEnrollCourseMutation();

  useEffect(() => {
    if (!open || !students.length) return;
    setInitialAssigned((prev) => {
      const next = { ...prev };
      for (const student of students) {
        if (next[student.id] === undefined) {
          next[student.id] = isStudentAssigned(student, courseId);
        }
      }
      return next;
    });
  }, [students, courseId, open]);

  const getEffectiveAssigned = (student: User) => {
    if (pendingStatus[student.id] !== undefined) {
      return pendingStatus[student.id];
    }
    if (initialAssigned[student.id] !== undefined) {
      return initialAssigned[student.id];
    }
    return isStudentAssigned(student, courseId);
  };

  const isDirtyStudent = (studentId: string) => {
    if (pendingStatus[studentId] === undefined) return false;
    const initial = initialAssigned[studentId];
    if (initial === undefined) return true;
    return pendingStatus[studentId] !== initial;
  };

  const dirtyCount = useMemo(() => {
    return Object.entries(pendingStatus).filter(([id, desired]) => {
      const initial = initialAssigned[id];
      if (initial === undefined) return true;
      return desired !== initial;
    }).length;
  }, [pendingStatus, initialAssigned]);

  const resolveInitialAssigned = (userId: string) => {
    if (initialAssigned[userId] !== undefined) return initialAssigned[userId];
    const student = students.find((s) => s.id === userId);
    return student ? isStudentAssigned(student, courseId) : false;
  };

  const setDesiredStatus = (userId: string, desired: boolean) => {
    const resolvedInitial = resolveInitialAssigned(userId);

    setInitialAssigned((prev) => {
      if (prev[userId] !== undefined) return prev;
      return { ...prev, [userId]: resolvedInitial };
    });

    setPendingStatus((prev) => {
      const next = { ...prev };
      if (desired === resolvedInitial) {
        delete next[userId];
      } else {
        next[userId] = desired;
      }
      return next;
    });
  };

  const handleToggleStatus = (userId: string) => {
    const student = students.find((s) => s.id === userId);
    const current = student
      ? getEffectiveAssigned(student)
      : (pendingStatus[userId] ?? false);
    setDesiredStatus(userId, !current);
  };

  const handleToggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const pageIds = students.map((s) => s.id);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  const somePageSelected =
    pageIds.some((id) => selectedIds.has(id)) && !allPageSelected;

  const handleSelectAllPage = (checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const id of pageIds) {
        if (checked) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  };

  const applyStatusToSelected = (desired: boolean) => {
    if (selectedIds.size === 0) {
      toast.error("Select at least one student");
      return;
    }
    for (const id of selectedIds) {
      setDesiredStatus(id, desired);
    }
    setSelectedIds(new Set());
  };

  const resetLocalState = () => {
    setSelectedIds(new Set());
    setPendingStatus({});
    setInitialAssigned({});
    setPage(1);
    setSearchTerm("");
    setSelectedGroupId("all");
  };

  const handleSave = async () => {
    const assign: string[] = [];
    const unassign: string[] = [];

    for (const [userId, desired] of Object.entries(pendingStatus)) {
      const initial = resolveInitialAssigned(userId);
      if (desired === initial) continue;
      if (desired) assign.push(userId);
      else unassign.push(userId);
    }

    if (assign.length === 0 && unassign.length === 0) {
      toast.message("No changes to save");
      return;
    }

    try {
      const result = await bulkEnroll({
        courseId,
        assign,
        unassign,
      }).unwrap();

      const payload = result?.data ?? result;
      toast.success(
        `Assigned: ${payload.assigned ?? 0}, Unassigned: ${payload.unassigned ?? 0}, Errors: ${payload.errors ?? 0}`,
      );

      setPendingStatus({});
      setSelectedIds(new Set());
      setInitialAssigned({});
    } catch (err) {
      console.error(err);
      toast.error("Failed to update assignments");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetLocalState();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserCog className="h-4 w-4" />
          Students
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-h-[90vh] !max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Students</DialogTitle>
          <p className="text-muted-foreground text-sm">
            Students are unassigned by default. Select or toggle changes, then
            save.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {groups.length === 0 ? (
            <div className="py-10 text-center">
              <Users className="text-muted-foreground/50 mx-auto h-12 w-12" />
              <p className="text-muted-foreground mt-2">
                Assign at least one class to this course first.
              </p>
            </div>
          ) : (
            <>
              <Tabs
                value={selectedGroupId}
                onValueChange={(value) => {
                  setSelectedGroupId(value);
                  setPage(1);
                  setSelectedIds(new Set());
                }}
              >
                <TabsList className="flex h-auto flex-wrap">
                  <TabsTrigger value="all">All</TabsTrigger>
                  {groups.map((group) => (
                    <TabsTrigger key={group.id} value={group.id}>
                      {group.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <div className="border-border flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">Students</h2>
                  <Badge variant="outline">
                    {data?.meta?.total || 0} Total
                  </Badge>
                  {dirtyCount > 0 && (
                    <Badge variant="secondary">{dirtyCount} pending</Badge>
                  )}
                </div>
                <SearchStudents
                  value={searchTerm}
                  onSearch={(term) => {
                    setSearchTerm(term);
                    setPage(1);
                    setSelectedIds(new Set());
                  }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => applyStatusToSelected(true)}
                  disabled={selectedIds.size === 0}
                >
                  Assign Selected
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => applyStatusToSelected(false)}
                  disabled={selectedIds.size === 0}
                >
                  Unassign Selected
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSave}
                  disabled={dirtyCount === 0 || isSaving}
                >
                  {isSaving
                    ? "Saving..."
                    : `Save Changes${dirtyCount ? ` (${dirtyCount})` : ""}`}
                </Button>
              </div>

              <div>
                {isLoading || isFetching ? (
                  <TableSkeleton
                    headers={["", "Student", "Assignment Status"]}
                  />
                ) : error ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">
                      Failed to load students
                    </p>
                  </div>
                ) : students.length === 0 ? (
                  <div className="py-8 text-center">
                    <Users className="text-muted-foreground/50 mx-auto h-12 w-12" />
                    <p className="text-muted-foreground mt-2">
                      No students found
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10">
                          <Checkbox
                            checked={
                              allPageSelected
                                ? true
                                : somePageSelected
                                  ? "indeterminate"
                                  : false
                            }
                            onCheckedChange={(checked) =>
                              handleSelectAllPage(checked === true)
                            }
                            aria-label="Select all on page"
                          />
                        </TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead className="text-right">
                          Assignment Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody colSpan={3}>
                      {students.map((student) => (
                        <StudentRow
                          key={student.id}
                          student={student}
                          selected={selectedIds.has(student.id)}
                          onToggleSelect={handleToggleSelect}
                          effectiveAssigned={getEffectiveAssigned(student)}
                          isDirty={isDirtyStudent(student.id)}
                          onToggleStatus={handleToggleStatus}
                        />
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {!isLoading && !error && (data?.meta?.totalPage || 1) > 1 && (
                <div className="border-t pt-4">
                  <Pagination
                    totalPages={data?.meta?.totalPage || 1}
                    page={page}
                    onPageChange={(nextPage) => {
                      setPage(nextPage);
                      setSelectedIds(new Set());
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
