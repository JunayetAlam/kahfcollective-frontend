/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDeleteGroupMutation } from "@/redux/api/groupApi";

interface DeleteGroupProps {
  forumId: string;
}

export default function DeleteGroup({ forumId }: DeleteGroupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteGroup, { isLoading }] = useDeleteGroupMutation();

  const handleDelete = async () => {
    try {
      await deleteGroup(forumId).unwrap();
      toast.success("Group deleted successfully!");
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete the group.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="destructive"
        size="icon"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 size={16} />
      </Button>

      <DialogContent className="!max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Group</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this group? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
