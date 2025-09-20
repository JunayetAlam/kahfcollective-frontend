import { Forum, JoinForum } from "./forum.type";
import { User } from "./user.type";

export interface Post {
  id: string;
  message: string;
  userId: string;
  forumId: string;
  isDeleted: boolean;
  isPublished: boolean;
  user: User;
  forum: Forum;
  createdAt: string;
  updatedAt: string;
  reacts?: React[];
  replies?: Reply[];
}

export interface React {
  id: string;
  joinForumId: string;
  postId: string;
  isDeleted: boolean;
  joinForum: JoinForum;
  post: Post;
  createdAt: string;
  updatedAt: string;
}

export interface Reply {
  id: string;
  joinForumId: string;
  postId: string;
  forumId: string;
  parentReplyId?: string | null;
  isDeleted: boolean;
  message: string;
  joinForum: JoinForum;
  post: Post;
  parentReply?: Reply | null;
  childrenReplies?: Reply[];
  createdAt: string;
  updatedAt: string;
}
