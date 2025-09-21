import { Payment } from "./payment.type";
import { Post } from "./post.type";
import { Course, CourseContents, CourseEnroll, Quiz } from "./course.type";

export type UserRoleEnum = "USER" | "INSTRUCTOR" | "SUPERADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";
export type GenderEnum = "MALE" | "FEMALE" | "OTHER";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: UserRoleEnum;

  address: string;
  introduction: string;
  isReferredBySheikhSalmam: boolean;
  referredBy?: string | null;
  gender: GenderEnum;

  // education
  majorOrProfession: string;
  haveTakenCoursesBefore: boolean;
  isTakeCourseWithSheikh: boolean;
  coursesName?: string | null;
  howLongInCourse?: string | null;

  status: UserStatus;

  bio?: string | null;
  profile?: string | null;
  otp?: string | null;
  otpExpiry?: string | null;

  isEmailVerified: boolean;
  emailVerificationToken?: string | null;
  emailVerificationTokenExpires?: string | null;

  // Relations
  payments?: Payment[];
  content?: Content[];
  posts?: Post[];
  joinForums?: JoinForum[];
  quizAnswers?: QuizAnswers[];
  courses?: Course[];
  coursesContents?: CourseContents[];
  quizzes?: Quiz[];
  coursesEnroll?: CourseEnroll[];

  createdAt: string;
  updatedAt: string;
}
