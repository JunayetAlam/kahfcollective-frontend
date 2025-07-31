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