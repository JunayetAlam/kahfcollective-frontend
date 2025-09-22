import { Forum } from "./forum.type";
import { Tier } from "./tiers.type";
import { User } from "./user.type";

export type CourseStatus = "DRAFT" | "ACTIVE" | "HIDDEN";
export type CourseContentTypeEnum = "VIDEO" | "QUIZ";
export type ContentStatusEnum = "PUBLISHED" | "DRAFT";
export type RightAnswer = "A" | "B" | "C" | "D";

export interface Options {
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  tierId: string;
  status: CourseStatus;
  language: string;
  isDeleted: boolean;
  instructorId: string;
  forums?: Forum[];
  courseContents: CourseContents[];
  coursesEnroll?: CourseEnroll[];
  tier: Tier;
  instructor: User;
  createdAt: string;
  updatedAt: string;
  _count: {
    courseContents: number;
  };
  completeCourses: {
    id: string;
    createdAt: string;
    updatedAt: string;
    courseId: string;
    userId: string;
  }[]
}

export interface CourseEnroll {
  id: string;
  userId: string;
  courseId: string;
  isEnrolled: boolean;
  user: User;
  course: Course;
  createdAt: string;
  updatedAt: string;
}

export interface CourseContents {
  id: string;
  type: CourseContentTypeEnum;
  title: string;
  description: string;
  videoUrl?: string | null;
  quizzes?: Quiz[];
  status: ContentStatusEnum;
  isDeleted: boolean;
  index: number;
  courseId: string;
  instructorId: string;
  course: Course;
  instructor: User;
  createdAt: string;
  updatedAt: string;
}

export interface Quiz {
  options: QuizOptions;
  id: string;
  courseContentId: string;
  instructorId: string;
  question: string;
  rightAnswer: string;
  isDeleted: boolean;
  index: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizOptions {
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface QuizAnswers {
  id: string;
  quizId: string;
  userId: string;
  answer: RightAnswer;
  rightAnswer?: RightAnswer | null;
  isRight?: boolean | null;
  isDeleted: boolean;
  isLocked: boolean;
  quiz: Quiz;
  user: User;
  createdAt: string;
  updatedAt: string;
}
