import { Group, JoinGroup } from "./group.type";
import { User } from "./user.type";

export interface Post {
  id: string;
  message: string;
  userId: string;
  forumId: string;
  isDeleted: boolean;
  isPublished: boolean;
  user: User;
  forum?: Group;
  createdAt: string;
  updatedAt: string;
  reacts?: React[];
  replies?: Reply[];
  _count: {
    reacts: number
    replies: number
  }
}

export interface React {
  id: string;
  joinForumId: string;
  postId: string;
  isDeleted: boolean;
  joinForum: JoinGroup;
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
  joinForum: JoinGroup;
  post: Post;
  user: User;
  userId: string;
  parentReply?: Reply | null;
  childrenReplies?: Reply[];
  createdAt: string;
  updatedAt: string;
}
