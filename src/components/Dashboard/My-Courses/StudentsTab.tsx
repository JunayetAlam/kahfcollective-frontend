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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Student } from "@/types";

interface StudentsTabProps {
    students: Student[];
}

export function StudentsTab({ students }: StudentsTabProps) {
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
                    {students.map((student) => (
                        <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Progress value={student.progress} className="w-24" />
                                    <span className="text-sm">{student.progress}%</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">
                                    {student.lastAccess}
                                </Badge>
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