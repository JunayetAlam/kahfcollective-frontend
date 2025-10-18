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
import { useDeleteUserMutation } from "@/redux/api/userApi";

interface DeleteUserProps {
  userId: string;
}

export default function DeleteUser({ userId }: DeleteUserProps) {
  const [isOpen, setIsOpen] = useState(false); // control dialog open state
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  const handleDelete = async () => {
    try {
      await deleteUser(userId).unwrap();
      toast.success("User deleted successfully!");
      setIsOpen(false); // close dialog after success
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete the user.");
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
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this user? This action cannot be undone.
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
