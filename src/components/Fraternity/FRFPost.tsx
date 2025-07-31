'use client'
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Heart, MessageCircle } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { PostType } from '@/types';
import { comments } from '@/data';
import { IoIosSend } from 'react-icons/io';
import { Button } from '../ui/button';
import FRF_SingleComment from './FRF_SingleComment';

export default function FRFPost({ post }: { post: PostType }) {
    const [showAllComments, setShowAllComments] = useState(false);
    const [newComment, setNewComment] = useState('');

    // Show only first comment initially, all comments when expanded
    const visibleComments = showAllComments ? comments : comments.slice(0, 1);
    const remainingCommentsCount = comments.length - 1;

    const handleCommentSubmit = () => {
        if (newComment.trim()) {
            // Handle comment submission logic here
            console.log('New comment:', newComment);
            setNewComment('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleCommentSubmit();
        }
    };

    return (
        <div className="border p-4 lg:p-8 border-gray-200 rounded-xl space-y-6">
            <div className='flex gap-2'>
                <Avatar className="w-10 h-10">
                    <AvatarImage src={post.authorProfile} alt={post?.author || 'NA'} />
                    <AvatarFallback>{post.author.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-semibold text-gray-800">{post?.author || 'NA'}</div>
                    <div className="text-sm text-gray-500">{post.timeAgo}</div>
                </div>
            </div>

            <div className='flex flex-col gap-6'>
                <p className="text-gray-700">{post.content}</p>

                <div className="grid grid-cols-2 text-gray-600 text-sm gap-2">
                    <div className="flex items-center gap-2.5 justify-center h-10 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-50 border border-transparent hover:border-gray-200">
                        <Heart className="w-5 h-5 text-red-500" />
                        <span className="font-medium">{post.likes}</span>
                    </div>
                    <Button
                    size={'lg'}
                        variant={'outline'}
                        onClick={() => setShowAllComments(!showAllComments)}
                    >
                        <MessageCircle className="w-5 h-5 fill-current" />
                        {post.comments}
                    </Button>
                </div>

                {/* Comments Section */}
                <div className="space-y-4">
                    {/* Display comments */}
                    {visibleComments.map(comment => (
                        <FRF_SingleComment key={comment.id} comment={comment} />
                    ))}

                    {/* Show more comments button */}
                    {!showAllComments && remainingCommentsCount > 0 && (
                        <button
                            onClick={() => setShowAllComments(true)}
                            className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200 px-2 py-1 hover:bg-gray-50 rounded"
                        >
                            View {remainingCommentsCount} more comment{remainingCommentsCount > 1 ? 's' : ''}
                        </button>
                    )}

                    {/* Show less comments button */}
                    {showAllComments && comments.length > 1 && (
                        <button
                            onClick={() => setShowAllComments(false)}
                            className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200 px-2 py-1 hover:bg-gray-50 rounded"
                        >
                            Show less
                        </button>
                    )}

                    {/* Comment input section */}
                    <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Ma" />
                            <AvatarFallback>M</AvatarFallback>
                        </Avatar>

                        <div className="w-full">
                            <div className="flex gap-3 items-end">
                                <div className="flex-1">
                                    <Textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Write your comment..."
                                        className="w-full min-h-[60px] resize-none border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <button
                                    onClick={handleCommentSubmit}
                                    disabled={!newComment.trim()}
                                    className='bg-primary text-background size-9 rounded-md flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors duration-200'
                                >
                                    <IoIosSend size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}