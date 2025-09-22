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
    useGetAllTiersAdminQuery,
    useCreateTierMutation,
    useUpdateTierMutation,
    useToggleDeleteTierMutation,
} from "@/redux/api/tierApi";
import { Tier } from "@/types/tiers.type";
import TableSkeleton from "@/components/Global/TableSkeleton";
import { toast } from "sonner";

interface TierRowProps {
    tier: Tier;
}

const TierRow: React.FC<TierRowProps> = ({ tier }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editName, setEditName] = useState(tier.name);

    const [updateTier, { isLoading: isUpdating }] = useUpdateTierMutation();
    const [toggleDeleteTier, { isLoading: isToggling }] = useToggleDeleteTierMutation();

    const handleUpdateTier = async () => {
        if (!editName.trim()) {
            toast.error('Tier name cannot be empty');
            return;
        }

        try {
            await updateTier({
                id: tier.id,
                data: { name: editName.trim() }
            }).unwrap();

            toast.success('Tier updated successfully');
            setIsEditOpen(false);
        } catch (error: any) {
            toast.error('Failed to update tier');
        }
    };

    const handleToggleVisibility = async () => {
        try {
            await toggleDeleteTier(tier.id).unwrap();

            toast.success("`Tier ${tier.isDeleted ? 'shown' : 'hidden'} successfully`");
        } catch (error: any) {
            toast.error("Failed to toggle tier visibility");
        }
    };

    return (
        <TableRow className={tier.isDeleted ? "opacity-50" : ""}>
            <TableCell className="font-medium">{tier.name}</TableCell>
            <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${tier.isDeleted
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                    {tier.isDeleted ? "Hidden" : "Visible"}
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
                                onClick={() => setEditName(tier.name)}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Tier</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="edit-tier-name">Tier Name</Label>
                                    <Input
                                        id="edit-tier-name"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        placeholder="Enter tier name"
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
                                        onClick={handleUpdateTier}
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
                        ) : tier.isDeleted ? (
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

export default function TierManagement() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newTierName, setNewTierName] = useState("");

    const { data, isLoading } = useGetAllTiersAdminQuery([]);
    const [createTier, { isLoading: isCreating }] = useCreateTierMutation();

    const tiers = data?.data || [];

    const handleCreateTier = async () => {
        if (!newTierName.trim()) {
            toast.error("Tier name cannot be empty");
            return;
        }

        try {
            await createTier({ name: newTierName.trim() }).unwrap();

            toast.success("Tier created successfully");

            setNewTierName("");
            setIsCreateOpen(false);
        } catch (error: any) {
            toast.error("Failed to create tier");
        }
    };

    return (
        <div className="rounded-lg p-6 bg-background border border-border">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-border">
                <h1 className="text-lg font-semibold">Tier Management</h1>

                {/* Add Tier Button */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setNewTierName("")}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Tier
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Tier</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="new-tier-name">Tier Name</Label>
                                <Input
                                    id="new-tier-name"
                                    value={newTierName}
                                    onChange={(e) => setNewTierName(e.target.value)}
                                    placeholder="Enter tier name"
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
                                    onClick={handleCreateTier}
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
                        <TableBody>
                            {tiers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                        No tiers found. Create your first tier to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tiers.map((tier) => (
                                    <TierRow key={tier.id} tier={tier} />
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}