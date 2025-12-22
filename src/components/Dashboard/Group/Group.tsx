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
    useGetAllGroupsAdminQuery,
    useCreateGroupMutation,
    useUpdateGroupMutation,
    useToggleDeleteGroupMutation,
} from "@/redux/api/groupApi";
import { Group } from "@/types/groups.type";
import TableSkeleton from "@/components/Global/TableSkeleton";
import { toast } from "sonner";

interface GroupRowProps {
    group: Group;
}

const GroupRow: React.FC<GroupRowProps> = ({ group }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editName, setEditName] = useState(group.name);

    const [updateGroup, { isLoading: isUpdating }] = useUpdateGroupMutation();
    const [toggleDeleteGroup, { isLoading: isToggling }] = useToggleDeleteGroupMutation();

    const handleUpdateGroup = async () => {
        if (!editName.trim()) {
            toast.error('Group name cannot be empty');
            return;
        }

        try {
            await updateGroup({
                id: group.id,
                data: { name: editName.trim() }
            }).unwrap();

            toast.success('Group updated successfully');
            setIsEditOpen(false);
        } catch (error: any) {
            toast.error('Failed to update group');
        }
    };

    const handleToggleVisibility = async () => {
        try {
            await toggleDeleteGroup(group.id).unwrap();

            toast.success("`Group ${group.isDeleted ? 'shown' : 'hidden'} successfully`");
        } catch (error: any) {
            toast.error("Failed to toggle group visibility");
        }
    };

    return (
        <TableRow className={group.isDeleted ? "opacity-50" : ""}>
            <TableCell className="font-medium">{group.name}</TableCell>
            <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${group.isDeleted
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                    }`}>
                    {group.isDeleted ? "Hidden" : "Visible"}
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
                                onClick={() => setEditName(group.name)}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Group</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="edit-group-name">Group Name</Label>
                                    <Input
                                        id="edit-group-name"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        placeholder="Enter group name"
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
                                        onClick={handleUpdateGroup}
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
                        ) : group.isDeleted ? (
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

export default function GroupManagement() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");

    const { data, isLoading } = useGetAllGroupsAdminQuery([]);
    const [createGroup, { isLoading: isCreating }] = useCreateGroupMutation();

    const groups = data?.data || [];

    const handleCreateGroup = async () => {
        if (!newGroupName.trim()) {
            toast.error("Group name cannot be empty");
            return;
        }

        try {
            await createGroup({ name: newGroupName.trim() }).unwrap();

            toast.success("Group created successfully");

            setNewGroupName("");
            setIsCreateOpen(false);
        } catch (error: any) {
            toast.error("Failed to create group");
        }
    };

    return (
        <div className="rounded-lg p-6 bg-background border border-border">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-border">
                <h1 className="text-lg font-semibold">Group Management</h1>

                {/* Add Group Button */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setNewGroupName("")}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Group
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Group</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="new-group-name">Group Name</Label>
                                <Input
                                    id="new-group-name"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    placeholder="Enter group name"
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
                                    onClick={handleCreateGroup}
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
                            {groups.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                        No groups found. Create your first group to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                groups.map((group) => (
                                    <GroupRow key={group.id} group={group} />
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}