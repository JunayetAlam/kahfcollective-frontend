import { Tier } from "./tiers.type";

export type T_Course = {
  id: string;
  title: string;
  description: string;
  tierId: string;
  status: string;
  language: string;
  isDeleted: boolean;
  instructorId: string;
  createdAt: string;
  updatedAt: string;
  tier: Tier;
  instructor: Instructor;
  courseContents: CourseContent[];
  lessons: number;
  tests: number;
  _count: {
    courseContents: number;
  };
};

export interface Instructor {
  id: string;
  fullName: string;
  email: string;
  profile: any;
}

export interface CourseContent {
  id: string;
  type: string;
  status: string;
  index: number;
  createdAt: string;
  title: string;
  description: string;
}
