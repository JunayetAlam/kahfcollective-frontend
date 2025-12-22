/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  useDeleteContentByIdMutation,
  useToggleIsFeaturedMutation,
} from "@/redux/api/contentApi";
import EditContent from './EditContent';

interface ContentItemProps {
  content: any; // You can replace 'any' with your Content type
}

export default function ContentRow({ content }: ContentItemProps) {
  const [openConfirm, setOpenConfirm] = useState(false);

  const [deleteContent, { isLoading: isDeleteLoading }] = useDeleteContentByIdMutation();
  const [toggleFeatured, { isLoading: isToggleLoading }] = useToggleIsFeaturedMutation();

  const handleDelete = async () => {
    try {
      await deleteContent(content.id).unwrap();
      toast.success("Content deleted successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to delete content");
    } finally {
      setOpenConfirm(false);
    }
  };

  const handleToggleFeatured = async () => {
    try {
      await toggleFeatured(content.id).unwrap();
      toast.success(
        `Content ${content.isFeatured ? "unfeatured" : "featured"} successfully!`
      );
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to toggle featured");
    }
  };
  return (
    <TableRow>
      <TableCell className="font-medium">
        <Badge variant="secondary">{content.contentType}</Badge>
      </TableCell>
      <TableCell className="font-medium">{content.author.fullName}</TableCell>
      <TableCell className="truncate">{content.title}</TableCell>
      <TableCell>{content.group.name}</TableCell>
      <TableCell className="flex items-center space-x-2">
        {/* Featured Switch */}
        <div className="relative flex items-center">
          <Switch
            checked={content.isFeatured}
            onCheckedChange={handleToggleFeatured}
            disabled={isToggleLoading}
          />
          {isToggleLoading && (
            <span className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin border-2 border-gray-300 rounded-full border-t-gray-500" />
          )}
        </div>
        <EditContent contentId={content.id} />

        {/* Delete Dialog */}
        <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setOpenConfirm(true)}
              disabled={isDeleteLoading}
            >
              <Trash />
            </Button>
          </DialogTrigger>
          <DialogContent className="!max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <p>This action cannot be undone.</p>
            </DialogHeader>
            <DialogFooter className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setOpenConfirm(false)}
                disabled={isDeleteLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleteLoading}
              >
                {isDeleteLoading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}
