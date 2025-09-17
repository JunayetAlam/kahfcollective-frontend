export type UserRoleEnum = "USER" | "INSTRUCTOR" | "SUPERADMIN";

export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export type GenderEnum = "MALE" | "FEMALE" | "OTHER"; // Adjust based on your Prisma GenderEnum

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

  majorOrProfession: string;
  haveTakenCoursesBefore: boolean;
  coursesName: string;
  howLongInCourse?: string | null;

  status: UserStatus;

  bio?: string | null;
  profile?: string | null;

  otp?: string | null;
  otpExpiry?: string | null;

  isEmailVerified: boolean;
  emailVerificationToken?: string | null;
  emailVerificationTokenExpires?: string | null;

  //   payments?: Payment[];

  createdAt: string;
  updatedAt: string;
}
