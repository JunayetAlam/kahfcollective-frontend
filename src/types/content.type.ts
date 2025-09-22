/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

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
