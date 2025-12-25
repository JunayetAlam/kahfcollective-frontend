import { Forum } from "./forum.type";
import { Group } from "./groups.type";
import { User } from "./user.type";

export type CourseStatus = "DRAFT" | "ACTIVE" | "HIDDEN";
export type CourseContentTypeEnum = "VIDEO" | "QUIZ" | "PDF";
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
  status: CourseStatus;
  language: string;
  isDeleted: boolean;
  instructorId: string;
  forums?: Forum[];
  courseContents: CourseContents[];
  coursesEnroll?: CourseEnroll[];
  groupCourses: GroupCourses[];
  instructor: User;
  createdAt: string;
  updatedAt: string;
  _count: {
    courseContents: number;
    enrollCourses: number;
  };
  completeCourses: {
    id: string;
    createdAt: string;
    updatedAt: string;
    courseId: string;
    userId: string;
  }[];
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
  pdfUrl?: string | null;
  quizzes?: Quiz[];
  status: ContentStatusEnum;
  isDeleted: boolean;
  index: number;
  courseId: string;
  instructorId: string;
  courseQuestions?: CourseQuestion;
  course: Course;
  instructor: User;
  createdAt: string;
  updatedAt: string;
  hasAnswered: boolean;
}

export interface CourseQuestion {
  courseContentId: string;
  createdAt: string;
  id: string;
  instructorId: string;
  question: string;
  updatedAt: string;
  answer?: {
    providedAnswer: string;
    isCorrectAnswer: boolean | undefined;
  };
}

export interface Quiz {
  type: "MULTIPLE_CHOICE" | "WRITE_ANSWER";
  options: QuizOptions;
  id: string;
  courseContentId: string;
  instructorId: string;
  question: string;
  rightAnswer: string;
  isDeleted: boolean;
  index: number;
  quizAnswers: QuizAnswers[];
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

export type EnrollCourse = {
  id: string;
  userId: string;
  courseId: string;
  user: User;
  course: Course;
  createdAt: string;
  updatedAt: string;
};

export type GroupCourses = {
  id: string;
  courseId: string;
  groupId: string;
  group: Group;
  course: Course;
};
