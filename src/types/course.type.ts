import { Group } from "./group.type";
import { Class } from "./class.type";
import { User } from "./user.type";

export type CourseStatus = "DRAFT" | "ACTIVE" | "HIDDEN";
export type CourseContentTypeEnum =
  | "VIDEO"
  | "QUIZ"
  | "PDF"
  | "TEXT"
  | "VIDEO_LINK"
  | "MEETING_LINK";
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
  thumbnail?: string | null;
  isDeleted: boolean;
  instructorId: string;
  forums?: Group[];
  courseContents: CourseContents[];
  items?: CourseTreeItem[];
  semesters?: Semester[];
  coursesEnroll?: CourseEnroll[];
  groupCourses: GroupCourses[];
  instructor: User;
  lessons?: number;
  tests?: number;
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

export interface Semester {
  id: string;
  name: string;
  index: number;
  courseId: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Chapter {
  id: string;
  name: string;
  index: number;
  semesterId: string;
  courseId: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ContentTreeNode = CourseContents & {
  nodeType: "CONTENT";
};

export type ChapterTreeNode = {
  nodeType: "CHAPTER";
  id: string;
  name: string;
  index: number;
  semesterId: string;
  courseId: string;
  contents: CourseContents[];
};

export type SemesterTreeNode = {
  nodeType: "SEMESTER";
  id: string;
  name: string;
  index: number;
  courseId: string;
  items: Array<ChapterTreeNode | ContentTreeNode>;
};

export type CourseTreeItem = SemesterTreeNode | ContentTreeNode;

export type ContentScope = "COURSE" | "SEMESTER" | "CHAPTER";

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
  text?: string | null;
  meetingLink?: string | null;
  videoLink?: string | null;
  quizzes?: Quiz[];
  status: ContentStatusEnum;
  isDeleted: boolean;
  index: number;
  courseId: string;
  semesterId?: string | null;
  chapterId?: string | null;
  instructorId?: string;
  courseQuestions?: CourseQuestion;
  course?: Course;
  instructor?: User;
  createdAt: string;
  updatedAt: string;
  hasAnswered?: boolean;
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
  id?: string;
  userId?: string;
  courseId: string;
  user?: User;
  course?: Course;
  createdAt?: string;
  updatedAt?: string;
};

export type GroupCourses = {
  id: string;
  courseId: string;
  groupId: string;
  group: Class;
  course: Course;
};
