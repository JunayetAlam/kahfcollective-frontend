/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Heart, Loader2, MessageCircle } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import SCF_SingleComment from './SCF_SingleComment';
import { IoIosSend } from 'react-icons/io';
import { Button } from '../ui/button';
import { Post, TQueryParam } from '@/types';
import {
    useGetAllReplyForSpecificPostQuery,
    useReplyToPostMutation,
    useGiveReactMutation
} from '@/redux/api/postApi';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useGetMeQuery } from '@/redux/api/userApi';
import { formatTime } from '@/lib/formateTime';

export default function SCFPost({ post }: { post: Post }) {
    const [showAllComments, setShowAllComments] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [newComment, setNewComment] = useState('');
    const searchParams = useSearchParams();
    const { data: me } = useGetMeQuery(undefined);
    const page = searchParams.get('page') || '';
    const args: TQueryParam[] = [{ name: 'limit', value: '100' }];
    if (page) args.push({ name: 'page', value: page });

    const { data, isLoading } = useGetAllReplyForSpecificPostQuery({ postId: post.id, args });
    const [replyToPost, { isLoading: isReplying }] = useReplyToPostMutation();
    const [giveReact, { isLoading: isReacting }] = useGiveReactMutation();

    const reply = data?.data || [];
    const visibleComments = showAllComments ? reply : reply.slice(0, 1);

    const maxChars = 280;
    const isLong = post.message.length > maxChars;
    const displayText = expanded
        ? post.message
        : post.message.slice(0, maxChars);

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) {
            toast.error('Comment cannot be empty');
            return;
        }

        try {
            await replyToPost({
                id: post.id,
                data: { message: newComment }
            }).unwrap();

            setNewComment('');
            toast.success('Comment added successfully');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to add comment');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleCommentSubmit();
        }
    };

    const handleReact = async () => {
        try {
            await giveReact(post.id).unwrap();
            toast.success('Reaction updated');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to react');
        }
    };

    const isIReact = (post?.reacts || [])?.length > 0
    const timeLabel = formatTime(post.createdAt);
    return (
        <article className="space-y-5 py-8 first:pt-6 last:pb-6">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={post.user?.profile || ''} alt={post?.user?.fullName || 'NA'} />
                    <AvatarFallback>{post.user?.fullName?.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-semibold text-[#304437]">
                        {post?.user?.fullName || 'NA'}
                    </div>
                    <div className="text-sm text-[#6f7f63]">
                        {timeLabel}
                    </div>
                </div>
            </div>

            <div className="space-y-5">
                <div className="text-[15px] leading-relaxed text-[#304437]">
                    <div
                        dangerouslySetInnerHTML={{
                            __html: displayText.replace(/\n/g, '<br>'),
                        }}
                    />
                    {isLong && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="mt-2 text-sm font-medium text-[#5f7254] hover:underline"
                        >
                            {expanded ? 'See less' : 'See more'}
                        </button>
                    )}
                </div>

                <div className="flex gap-3 text-sm text-[#5c6b55]">
                    <button
                        onClick={handleReact}
                        disabled={isReacting}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-transparent transition-colors hover:border-[#d7ded0] hover:bg-[#f4f6f0] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isReacting ? (
                            <Loader2 className="h-5 w-5 animate-spin text-red-500" />
                        ) : (
                            <Heart className={`h-5 w-5 text-red-500 ${isIReact ? 'fill-red-500' : ''}`} />
                        )}
                        <span className="font-medium">{post._count?.reacts}</span>
                    </button>

                    <Button
                        size="lg"
                        variant="outline"
                        className="flex-1 border-[#d7ded0]"
                        onClick={() => setShowAllComments(!showAllComments)}
                    >
                        <MessageCircle className="h-5 w-5 fill-current" />
                        {post._count.replies}
                    </Button>
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        <div className="text-sm text-[#6f7f63]">Loading comments...</div>
                    ) : (
                        <>
                            {visibleComments.map(comment => (
                                <SCF_SingleComment key={comment.id} comment={comment} />
                            ))}

                            {!showAllComments && reply.length > 1 && (
                                <button
                                    onClick={() => setShowAllComments(true)}
                                    className="rounded px-2 py-1 text-sm font-medium text-[#5c6b55] transition-colors hover:bg-[#f4f6f0] hover:text-[#304437]"
                                >
                                    View {reply.length - 1} more comment{reply.length - 1 > 1 ? 's' : ''}
                                </button>
                            )}

                            {showAllComments && reply.length > 1 && (
                                <button
                                    onClick={() => setShowAllComments(false)}
                                    className="rounded px-2 py-1 text-sm font-medium text-[#5c6b55] transition-colors hover:bg-[#f4f6f0] hover:text-[#304437]"
                                >
                                    Show less
                                </button>
                            )}
                        </>
                    )}

                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={me?.data?.profile || ''} alt="Me" />
                            <AvatarFallback>{me?.data?.fullName?.slice(0, 2)}</AvatarFallback>
                        </Avatar>

                        <div className="w-full">
                            <div className="flex items-end gap-3">
                                <div className="flex-1">
                                    <Textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Write your comment..."
                                        disabled={isReplying}
                                        className="min-h-[60px] w-full resize-none rounded-md border border-[#d7ded0] p-3 focus:border-[#93a87e] focus:ring-2 focus:ring-[#93a87e]/30 focus:outline-none"
                                    />
                                </div>
                                <button
                                    onClick={handleCommentSubmit}
                                    disabled={!newComment.trim() || isReplying}
                                    className='flex size-9 items-center justify-center rounded-md bg-primary text-background transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'
                                >
                                    {isReplying ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <IoIosSend size={20} />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}
