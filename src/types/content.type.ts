import { User } from "./user.type";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  courseContentId: string;
  instructorId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export type SubmittedQuestion = {
  question: Question;
  isCorrectAnswer: any;
  createdAt: string;
  id: string;
  providedAnswer: string;
  questionId: string;
  user: User;
};

export interface CourseContentData {
  id: string;
  index: number;
  title: string;
  description: string;
  type: "VIDEO" | "QUIZ";
  status: "PUBLISHED" | "DRAFT";
  videoFile: File | null;
  questions: Question[];
}

export interface ContentDetailsFormProps {
  contentData: CourseContentData;
  onInputChange: (field: keyof CourseContentData, value: any) => void;
}

export interface ContentCreationFormProps {
  contentData: CourseContentData;
  onInputChange: (field: keyof CourseContentData, value: any) => void;
}

export interface ContentFormProps {
  isEdit?: boolean;
  existingContent?: CourseContentData | null;
  trigger?: React.ReactNode;
}
