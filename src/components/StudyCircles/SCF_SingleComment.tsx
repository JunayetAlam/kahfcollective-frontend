'use client';

import { Avatar } from '@radix-ui/react-avatar';
import React, { useState } from 'react';
import { AvatarFallback, AvatarImage } from '../ui/avatar';
import { Reply } from '@/types';
import { formatTime } from '@/lib/formateTime';
import { useGetMeQuery } from '@/redux/api/userApi';
import { useDeleteReplyMutation } from '@/redux/api/postApi';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from '../ui/dialog';
import { Trash2 } from 'lucide-react'; // Icon for delete button

export default function SCF_SingleComment({ comment }: { comment: Reply }) {
    const { data } = useGetMeQuery(undefined);
    const [deleteReply, { isLoading: deleteLoading }] = useDeleteReplyMutation();
    const [open, setOpen] = useState(false);

    const timeLabel = formatTime(comment.createdAt);
    const role = data?.data?.role || undefined;

    const handleDelete = async () => {
        try {
            await deleteReply(comment.id).unwrap();
            setOpen(false);
        } catch (error) {
            console.error('Failed to delete comment', error);
        }
    };

    return (
        <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8 rounded-full overflow-hidden">
                <AvatarImage src={comment?.user?.profile || ''} alt={comment?.user?.fullName || ''} />
                <AvatarFallback>{comment?.user?.fullName?.slice(0, 2) || 'NA'}</AvatarFallback>
            </Avatar>

            <div className="flex-1 bg-gray-50 py-3 pl-3 rounded-lg">
                <div className="flex justify-between items-center">
                    <div className="font-semibold text-gray-800 text-sm">{comment?.user?.fullName || 'N/A'}</div>
                    <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-500">{timeLabel}</div>
                        {role === 'SUPERADMIN' || role === 'INSTRUCTOR' ? (
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                   <Trash2  className="w-4 h-4 text-red-500 cursor-pointer" />
                                </DialogTrigger>
                                <DialogContent className="sm:!max-w-[400px]">
                                    <DialogHeader>
                                        <DialogTitle>Delete Comment</DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to delete this comment? This action cannot be undone.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
                                            {deleteLoading ? 'Deleting...' : 'Delete'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        ) : null}
                    </div>
                </div>

                <div
                    className="text-gray-700 text-sm"
                    dangerouslySetInnerHTML={{
                        __html: comment.message.replace(/\n/g, '<br>'),
                    }}
                />
            </div>
        </div>
    );
}
