import { Payment } from "./payment.type";
import { Post } from "./post.type";
import { Course, CourseContents, EnrollCourse, Quiz, QuizAnswers } from "./course.type";
import { NormalContent } from "./normal-content.type";
import { UserGroup } from "./groups.type";


export type UserRoleEnum = "USER" | "INSTRUCTOR" | "SUPERADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";
export type GenderEnum = "MALE" | "FEMALE" | "OTHER";

export interface User {
  id: string;
  fullName: string;
  name?: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: UserRoleEnum;

  address: string;
  currentClass: string;
  roll: number;
  subject?: string;
  introduction: string;
  gender: GenderEnum;

  status: UserStatus;

  profile?: string | null;
  otp?: string | null;
  otpExpiry?: string | null;

  isUserVerified: boolean
  isEmailVerified: boolean;
  emailVerificationToken?: string | null;
  emailVerificationTokenExpires?: string | null;

  // Relations
  payments?: Payment[];
  content?: NormalContent[];
  posts?: Post[];
  quizAnswers?: QuizAnswers[];
  courses?: Course[];
  coursesContents?: CourseContents[];
  quizzes?: Quiz[];
  userGroups: UserGroup[]
  enrollCourses: EnrollCourse[]
  createdAt: string;
  updatedAt: string;
}
