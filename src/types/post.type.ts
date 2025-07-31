export type PostType = {
    author: string;
    authorProfile: string;
    timeAgo: string;
    content: string;
    likes: number;
    comments: number;
};

export type CommentType = {
    id: string;
    username: string;
    userAvatarUrl?: string;
    comment: string;
};