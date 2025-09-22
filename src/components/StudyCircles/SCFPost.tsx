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
import { useAppSelector } from '@/redux/store';
import { useCurrentUser } from '@/redux/authSlice';
import { useGetMeQuery } from '@/redux/api/userApi';

export default function SCFPost({ post }: { post: Post }) {
    const [showAllComments, setShowAllComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const searchParams = useSearchParams();
    const {data:me} = useGetMeQuery(undefined);
    // query params
    const page = searchParams.get('page') || '';
    const args: TQueryParam[] = [{ name: 'limit', value: '100' }];
    if (page) args.push({ name: 'page', value: page });

    // API hooks
    const { data, isLoading } = useGetAllReplyForSpecificPostQuery({ postId: post.id, args });
    const [replyToPost, { isLoading: isReplying }] = useReplyToPostMutation();
    const [giveReact, { isLoading: isReacting }] = useGiveReactMutation();

    const reply = data?.data || [];
    const visibleComments = showAllComments ? reply : reply.slice(0, 1);

    // handle comment submit
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

    // handle enter press
    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleCommentSubmit();
        }
    };

    // handle like
    const handleReact = async () => {
        try {
            await giveReact(post.id).unwrap();
            toast.success('Reaction updated');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to react');
        }
    };

    const isIReact = (post?.reacts || [])?.length > 0

    return (
        <div className="border p-4 lg:p-8 border-gray-200 rounded-xl space-y-6">
            {/* Post header */}
            <div className='flex gap-2'>
                <Avatar className="w-10 h-10">
                    <AvatarImage src={post.user?.profile || ''} alt={post?.user?.fullName || 'NA'} />
                    <AvatarFallback>{post.user.fullName.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-semibold text-gray-800">{post?.user?.fullName || 'NA'}</div>
                    <div className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</div>
                </div>
            </div>

            {/* Post body */}
            <div className='flex flex-col gap-6'>
                <div dangerouslySetInnerHTML={{ __html: post.message }}></div>

                {/* Reacts & comments */}
                <div className="grid grid-cols-2 text-gray-600 text-sm gap-2">
                    <button
                        onClick={handleReact}
                        disabled={isReacting}
                        className="flex items-center gap-2.5 justify-center h-10 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-50 border border-transparent hover:border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isReacting ? (
                            <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                        ) : (
                            <Heart  className={`w-5 h-5 text-red-500 ${isIReact && 'fill-red-500'}`} />
                        )}
                        <span className="font-medium">{post._count?.reacts}</span>
                    </button>

                    <Button
                        size={'lg'}
                        variant={'outline'}
                        onClick={() => setShowAllComments(!showAllComments)}
                    >
                        <MessageCircle className="w-5 h-5 fill-current" />
                        {post._count.replies}
                    </Button>
                </div>

                {/* Comments Section */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="text-sm text-gray-500">Loading comments...</div>
                    ) : (
                        <>
                            {visibleComments.map(comment => (
                                <SCF_SingleComment key={comment.id} comment={comment} />
                            ))}

                            {!showAllComments && reply.length > 1 && (
                                <button
                                    onClick={() => setShowAllComments(true)}
                                    className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200 px-2 py-1 hover:bg-gray-50 rounded"
                                >
                                    View {reply.length - 1} more comment{reply.length - 1 > 1 ? 's' : ''}
                                </button>
                            )}

                            {showAllComments && reply.length > 1 && (
                                <button
                                    onClick={() => setShowAllComments(false)}
                                    className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200 px-2 py-1 hover:bg-gray-50 rounded"
                                >
                                    Show less
                                </button>
                            )}
                        </>
                    )}

                    {/* Add comment */}
                    <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={me?.data?.profile ||''} alt="Me" />
                            <AvatarFallback>{me?.data?.fullName.slice(0,2)}</AvatarFallback>
                        </Avatar>

                        <div className="w-full">
                            <div className="flex gap-3 items-end">
                                <div className="flex-1">
                                    <Textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Write your comment..."
                                        disabled={isReplying}
                                        className="w-full min-h-[60px] resize-none border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <button
                                    onClick={handleCommentSubmit}
                                    disabled={!newComment.trim() || isReplying}
                                    className='bg-primary text-background size-9 rounded-md flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors duration-200'
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
        </div>
    )
}
