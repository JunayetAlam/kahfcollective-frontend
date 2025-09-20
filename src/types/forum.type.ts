import { Course } from "./course.type";
import { Post, React, Reply } from "./post.type";
import { Tier } from "./tiers.type";
import { User } from "./user.type";

export type ForumTypeEnum = "STUDY_CIRCLES" | "LOCATION_BASED";

export interface Event {
  id: string;
  eventName?: string | null;
  about?: string | null;
  location?: string | null;
  date?: string | null;
  time?: string | null;
}

export interface Forum {
  id: string;
  title: string;
  forumType: ForumTypeEnum;
  description: string;
  courseId?: string | null;
  tierId?: string | null;
  country?: string | null;
  isDeleted: boolean;
  events?: Event[];
  posts?: Post[];
  joinForums?: JoinForum[];
  course?: Course | null;
  tier?: Tier | null;
  createdAt: string;
  updatedAt: string;
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
