import { Avatar } from '@radix-ui/react-avatar';
import React from 'react';
import { AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { CommentType } from '@/types';

export default function SCF_SingleComment({ comment }: { comment: CommentType }) {
    return (
        <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8 rounded-full overflow-hidden">
                <AvatarImage src={comment.userAvatarUrl} alt={comment.username} />
                <AvatarFallback>{comment.username.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 text-sm">{comment.username}</div>
                <p className="text-gray-700 text-sm mt-1">{comment.comment}</p>
                <Button variant="link" className="h-auto p-0 text-xs text-gray-500 mt-1">
                    Replay
                </Button>
            </div>
        </div>
    );
}