/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Eye, EyeOff, Loader2 } from "lucide-react";
import {
    useGetAllClassesAdminQuery,
    useCreateClassMutation,
    useUpdateClassMutation,
    useToggleDeleteClassMutation,
} from "@/redux/api/classApi";
import { Class } from "@/types/class.type";
import TableSkeleton from "@/components/Global/TableSkeleton";
import { toast } from "sonner";

interface ClassRowProps {
    classItem: Class;
}

const ClassRow: React.FC<ClassRowProps> = ({ classItem }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editName, setEditName] = useState(classItem.name);

    const [updateClass, { isLoading: isUpdating }] = useUpdateClassMutation();
    const [toggleDeleteClass, { isLoading: isToggling }] = useToggleDeleteClassMutation();

    const handleUpdateClass = async () => {
        if (!editName.trim()) {
            toast.error('Class name cannot be empty');
            return;
        }

        try {
            await updateClass({
                id: classItem.id,
                data: { name: editName.trim() }
            }).unwrap();

            toast.success('Class updated successfully');
            setIsEditOpen(false);
        } catch (error: any) {
            toast.error('Failed to update class');
        }
    };

    const handleToggleVisibility = async () => {
        try {
            await toggleDeleteClass(classItem.id).unwrap();

            toast.success(`Class ${classItem.isDeleted ? 'shown' : 'hidden'} successfully`);
        } catch (error: any) {
            toast.error("Failed to toggle class visibility");
        }
    };

    return (
        <TableRow className={classItem.isDeleted ? "opacity-50" : ""}>
            <TableCell className="font-medium">{classItem.name}</TableCell>
            <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${classItem.isDeleted
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                    }`}>
                    {classItem.isDeleted ? "Hidden" : "Visible"}
                </span>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                    {/* Edit Button */}
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditName(classItem.name)}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Class</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="edit-class-name">Class Name</Label>
                                    <Input
                                        id="edit-class-name"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        placeholder="Enter class name"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleUpdateClass}
                                        disabled={isUpdating}
                                    >
                                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Update
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Toggle Visibility Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleToggleVisibility}
                        disabled={isToggling}
                    >
                        {isToggling ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : classItem.isDeleted ? (
                            <Eye className="h-4 w-4" />
                        ) : (
                            <EyeOff className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
};

export default function ClassManagement() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newClassName, setNewClassName] = useState("");

    const { data, isLoading } = useGetAllClassesAdminQuery([]);
    const [createClass, { isLoading: isCreating }] = useCreateClassMutation();

    const classes = data?.data || [];

    const handleCreateClass = async () => {
        if (!newClassName.trim()) {
            toast.error("Class name cannot be empty");
            return;
        }

        try {
            await createClass({ name: newClassName.trim() }).unwrap();

            toast.success("Class created successfully");

            setNewClassName("");
            setIsCreateOpen(false);
        } catch (error: any) {
            toast.error("Failed to create class");
        }
    };

    return (
        <div className="rounded-lg p-6 bg-background border border-border">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-border">
                <h1 className="text-lg font-semibold">Class Management</h1>

                {/* Add Class Button */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setNewClassName("")}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Class
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Class</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="new-class-name">Class Name</Label>
                                <Input
                                    id="new-class-name"
                                    value={newClassName}
                                    onChange={(e) => setNewClassName(e.target.value)}
                                    placeholder="Enter class name"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsCreateOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreateClass}
                                    disabled={isCreating}
                                >
                                    {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Table */}
            <div className="overflow-hidden">
                {isLoading ? (
                    <TableSkeleton
                        headers={["Name", "Status", "Action"]}
                    />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody colSpan={3}>
                            {classes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                        No classes found. Create your first class to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                classes.map((classItem) => (
                                    <ClassRow key={classItem.id} classItem={classItem} />
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
