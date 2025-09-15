export type CourseCardType = {
  title: string
  rating: number
  instructor: string
  instructorProfile: string
  lessons: number
  image: string
  id: string
}

export type ModuleCourseItem = {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'document' | 'quiz';
};

export type Module = {
  id: string;
  name: string;
  courseCount: number;
  items: ModuleCourseItem[];
};

export interface CourseData {
  title: string;
  description: string;
  tierLevel: string;
  status: string;
}

export interface Student {
  id: number;
  name: string;
  progress: number;
  lastAccess: string;
}

export interface ManageCourseProps {
  courseData: CourseData;
  onCourseDataChange: (field: keyof CourseData, value: string) => void;
  onSaveChanges: () => void;
  onCancel: () => void;
  contentItems: CourseData[];
  students: Student[];
}