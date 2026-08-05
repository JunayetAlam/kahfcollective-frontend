export type ContentProgressStatus = "COMPLETED" | "IN_PROGRESS";

export type ContentProgress = {
  id: string;
  userId: string;
  courseContentId: string;
  courseId: string;
  semesterId: string | null;
  chapterId: string | null;
  status: ContentProgressStatus;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type AssessmentScore = {
  contentId: string;
  title: string;
  markPercent: number;
  total: number;
  correct: number;
  isLocked: boolean;
  attempted: boolean;
};

export type PerfUserBrief = {
  id: string;
  fullName: string;
  email: string;
  profile?: string | null;
  roll?: number | string | null;
  currentClass?: string | null;
};

export type StudentPerfCourse = {
  id: string;
  title: string;
  thumbnail: string | null;
  instructorId: string;
  quizAvgPercent: number;
  completionPercent: number;
  quizzesAttempted: number;
  quizzesTotal: number;
  rank: number | null;
  lastActivityAt: string | null;
};

export type StudentPerfSummary = {
  user: PerfUserBrief;
  overall: {
    quizAvgPercent: number;
    completionPercent: number;
    courseCount: number;
  };
  courses: StudentPerfCourse[];
};

export type ChapterPerfBreakdown = {
  id: string;
  name: string;
  index: number;
  quizAvgPercent: number;
  completionPercent: number;
  attemptRate: number;
  quizzesAttempted: number;
  quizzesTotal: number;
  contentsCompleted: number;
  contentsTotal: number;
  assessments: AssessmentScore[];
};

export type SemesterPerfBreakdown = {
  id: string;
  name: string;
  index: number;
  quizAvgPercent: number;
  completionPercent: number;
  attemptRate: number;
  chapters: ChapterPerfBreakdown[];
};

export type CoursePerfDetail = {
  course: {
    id: string;
    title: string;
    thumbnail: string | null;
  };
  rank: number | null;
  quizAvgPercent: number;
  completionPercent: number;
  attemptRate: number;
  quizzesAttempted: number;
  quizzesTotal: number;
  contentsCompleted: number;
  contentsTotal: number;
  lastActivityAt: string | null;
  assessments: AssessmentScore[];
  semesters: SemesterPerfBreakdown[];
};

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  user: PerfUserBrief;
  quizAvgPercent: number;
  completionPercent: number;
  quizzesAttempted: number;
  quizzesTotal: number;
  lastActivityAt: string | null;
};

export type StudentCompareSide = {
  user: PerfUserBrief;
  rank: number | null;
  quizAvgPercent: number;
  completionPercent: number;
  attemptRate: number;
  quizzesAttempted: number;
  quizzesTotal: number;
  contentsCompleted: number;
  contentsTotal: number;
  assessments: AssessmentScore[];
};

export type StudentCompareResult = {
  scope: {
    courseId?: string;
    semesterId?: string;
    chapterId?: string;
  };
  studentA: StudentCompareSide;
  studentB: StudentCompareSide;
  deltas: {
    quizAvg: number;
    completion: number;
    attemptRate: number;
  };
};

export type SubjectCompareSide = {
  chapterId: string;
  name: string;
  index: number;
  courseId: string;
  courseTitle: string;
  semesterId: string | null;
  semesterName: string;
  quizAvgPercent: number;
  completionPercent: number;
  attemptRate: number;
  quizzesAttempted: number;
  quizzesTotal: number;
  contentsCompleted: number;
  contentsTotal: number;
  assessments: AssessmentScore[];
};

export type SubjectCompareResult = {
  subjectA: SubjectCompareSide;
  subjectB: SubjectCompareSide;
  deltas: {
    quizAvg: number;
    completion: number;
    attemptRate: number;
  };
};
