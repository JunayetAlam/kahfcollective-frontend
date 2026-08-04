import { Course } from "./course.type";
import { Post, React, Reply } from "./post.type";
import { Class } from "./class.type";
import { User } from "./user.type";

export type GroupTypeEnum = "STUDY_CIRCLES" | "LOCATION_BASED";
export type GroupStatus = "PENDING" | 'PUBLISHED'
export interface Event {
  id?: string;
  eventName?: string;
  about?: string;
  location?: string;
  date?: string;
  time: string;
}

export interface Group {
  id: string;
  title: string;
  forumType: GroupTypeEnum;
  status: GroupStatus;
  description: string;
  courseId?: string | null;
  groupId?: string | null;
  country?: string | null;
  isDeleted: boolean;
  events?: Event[];
  posts?: Post[];
  joinForums?: JoinGroup[];
  course?: Course | null;
  group?: Class | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    posts: number
  }
}

export interface JoinGroup {
  id: string;
  userId: string;
  forumId: string;
  isLeave: boolean;
  isDeleted: boolean;
  user: User;
  forum: Group;
  replies?: Reply[];
  reacts?: React[];
  createdAt: string;
  updatedAt: string;
}

/** API shape aliases kept for response field names */
export type ForumTypeEnum = GroupTypeEnum;
export type Forum = Group;
export type JoinForum = JoinGroup;
export type ForumStatus = GroupStatus;
