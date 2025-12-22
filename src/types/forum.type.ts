import { Course } from "./course.type";
import { Post, React, Reply } from "./post.type";
import { Group } from "./groups.type";
import { User } from "./user.type";

export type ForumTypeEnum = "STUDY_CIRCLES" | "LOCATION_BASED";
export type ForumStatus = "PENDING" | 'PUBLISHED'
export interface Event {
  id?: string;
  eventName?: string;
  about?: string;
  location?: string;
  date?: string;
  time: string;
}

export interface Forum {
  id: string;
  title: string;
  forumType: ForumTypeEnum;
  status: ForumStatus;
  description: string;
  courseId?: string | null;
  groupId?: string | null;
  country?: string | null;
  isDeleted: boolean;
  events?: Event[];
  posts?: Post[];
  joinForums?: JoinForum[];
  course?: Course | null;
  group?: Group | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    posts: number
  }
}

export interface JoinForum {
  id: string;
  userId: string;
  forumId: string;
  isLeave: boolean;
  isDeleted: boolean;
  user: User;
  forum: Forum;
  replies?: Reply[];
  reacts?: React[];
  createdAt: string;
  updatedAt: string;
}
