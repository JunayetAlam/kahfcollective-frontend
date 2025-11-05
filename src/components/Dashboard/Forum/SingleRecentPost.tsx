'use client'

import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch"; // ShadCN switch
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToggleDeletePostMutation, useTogglePublishMutation } from '@/redux/api/postApi';
import { Post } from '@/types';
import { Loader2 } from "lucide-react"; // Spinner icon
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatTime } from '@/lib/formateTime';

interface PostItemProps {
    post: Post
}

export default function PostItem({ post }: PostItemProps) {
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [togglePublish, { isLoading: isToggleLoading }] = useTogglePublishMutation();
    const [deletePost, { isLoading: isDeleteLoading }] = useToggleDeletePostMutation();

    const timeLabel = formatTime(post.createdAt);
    const maxChars = 200;
    const isLong = post.message.length > maxChars;
    const displayText = expanded
        ? post.message
        : post.message.slice(0, maxChars);
    const handleToggle = async () => {
        await togglePublish(post.id);
    };

    const handleDelete = () => {
        deletePost(post.id);
        setOpen(false);
    };
    return (
        <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-4 w-full">
                <div className='flex justify-between items-center'>
                    <div className="flex gap-2 items-center">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={post.user?.profile || ''} alt={post?.user?.fullName || 'NA'} />
                            <AvatarFallback>{post.user?.fullName?.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-semibold text-foreground">
                                {post?.user?.fullName || 'NA'}
                            </div>
                            <div className="text-sm text-foreground/60">
                                {timeLabel}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Toggle Publish with Loading */}
                        <div className="relative">
                            <div className='flex gap-1 text-sm font-semibold'>
                                <Switch
                                    checked={post.isPublished}
                                    onCheckedChange={handleToggle}
                                    disabled={isToggleLoading}
                                />
                            </div>
                            {isToggleLoading && (
                                <Loader2 className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-spin text-gray-500" />
                            )}
                        </div>

                        {/* Delete Dialog */}
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button variant="destructive" size="sm" disabled={isDeleteLoading}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Delete Post</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to delete this post? This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="flex gap-2">
                                    <Button variant="secondary" onClick={() => setOpen(false)} disabled={isDeleteLoading}>
                                        Cancel
                                    </Button>
                                    <Button variant="destructive" onClick={handleDelete} disabled={isDeleteLoading}>
                                        {isDeleteLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : 'Delete'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: displayText.replace(/\n/g, '<br>'),
                        }}
                    />
                    {isLong && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="text-primary mt-1 underline"
                        >
                            {expanded ? 'See less' : 'See more'}
                        </button>
                    )}
                </div>

                <Badge variant="secondary" className="text-xs">
                    {post.isPublished ? 'Published' : 'Pending'}
                </Badge>
            </div>


        </div>
    );
}
