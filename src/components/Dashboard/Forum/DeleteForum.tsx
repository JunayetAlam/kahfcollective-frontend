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
import { useDeleteForumMutation } from "@/redux/api/forumApi";

interface DeleteForumProps {
  forumId: string;
}

export default function DeleteForum({ forumId }: DeleteForumProps) {
  const [isOpen, setIsOpen] = useState(false); // control dialog open state
  const [deleteForum, { isLoading }] = useDeleteForumMutation();

  const handleDelete = async () => {
    try {
      await deleteForum(forumId).unwrap();
      toast.success("Forum deleted successfully!");
      setIsOpen(false); // close dialog after success
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete the forum.");
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
          <DialogTitle>Delete Forum</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this forum? This action cannot be undone.
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
