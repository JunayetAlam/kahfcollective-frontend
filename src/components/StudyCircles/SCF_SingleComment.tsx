import { Avatar } from '@radix-ui/react-avatar';
import React from 'react';
import { AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Reply } from '@/types';

export default function SCF_SingleComment({ comment }: { comment: Reply }) {
    return (
        <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8 rounded-full overflow-hidden">
                <AvatarImage src={comment.post?.user?.profile || ''} alt={comment.post?.user?.fullName} />
                <AvatarFallback>{comment.post?.user?.fullName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 text-sm">{comment.post?.user?.fullName}</div>
                <div dangerouslySetInnerHTML={{ __html: comment.message }}></div>
               
            </div>
        </div>
    );
}