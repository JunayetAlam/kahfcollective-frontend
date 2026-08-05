import {
  ContentProgress,
  CoursePerfDetail,
  LeaderboardEntry,
  StudentCompareResult,
  StudentPerfSummary,
  SubjectCompareResult,
  TResponseRedux,
} from "@/types";
import { baseApi } from "./baseApi";

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    markContentProgress: builder.mutation({
      query: (courseContentId: string) => ({
        url: `/analytics/content-progress`,
        method: "POST",
        body: { courseContentId },
      }),
      invalidatesTags: ["Analytics"],
    }),

    getContentProgress: builder.query({
      query: (contentId: string) => ({
        url: `/analytics/content-progress/${contentId}`,
        method: "GET",
      }),
      transformResponse: (response: TResponseRedux<ContentProgress | null>) =>
        response.data,
      providesTags: ["Analytics"],
    }),

    getCourseCompletedContentIds: builder.query({
      query: (courseId: string) => ({
        url: `/analytics/content-progress/course/${courseId}`,
        method: "GET",
      }),
      transformResponse: (
        response: TResponseRedux<{ completedContentIds: string[] }>,
      ) => response.data?.completedContentIds ?? [],
      providesTags: ["Analytics"],
    }),

    getMyPerformance: builder.query({
      query: () => ({
        url: `/analytics/me`,
        method: "GET",
      }),
      transformResponse: (response: TResponseRedux<StudentPerfSummary>) =>
        response.data,
      providesTags: ["Analytics"],
    }),

    getMyCoursePerformance: builder.query({
      query: (courseId: string) => ({
        url: `/analytics/me/courses/${courseId}`,
        method: "GET",
      }),
      transformResponse: (response: TResponseRedux<CoursePerfDetail>) =>
        response.data,
      providesTags: ["Analytics"],
    }),

    getStudentPerformance: builder.query({
      query: (userId: string) => ({
        url: `/analytics/students/${userId}`,
        method: "GET",
      }),
      transformResponse: (response: TResponseRedux<StudentPerfSummary>) =>
        response.data,
      providesTags: ["Analytics"],
    }),

    getStudentCoursePerformance: builder.query({
      query: ({ userId, courseId }: { userId: string; courseId: string }) => ({
        url: `/analytics/students/${userId}/courses/${courseId}`,
        method: "GET",
      }),
      transformResponse: (response: TResponseRedux<CoursePerfDetail>) =>
        response.data,
      providesTags: ["Analytics"],
    }),

    getCourseLeaderboard: builder.query({
      query: (courseId: string) => ({
        url: `/analytics/courses/${courseId}/leaderboard`,
        method: "GET",
      }),
      transformResponse: (response: TResponseRedux<LeaderboardEntry[]>) =>
        response.data,
      providesTags: ["Analytics"],
    }),

    compareStudents: builder.query({
      query: (args: {
        userA: string;
        userB: string;
        courseId?: string;
        semesterId?: string;
        chapterId?: string;
      }) => {
        const params = new URLSearchParams();
        params.append("userA", args.userA);
        params.append("userB", args.userB);
        if (args.courseId) params.append("courseId", args.courseId);
        if (args.semesterId) params.append("semesterId", args.semesterId);
        if (args.chapterId) params.append("chapterId", args.chapterId);
        return {
          url: `/analytics/compare?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: TResponseRedux<StudentCompareResult>) =>
        response.data,
      providesTags: ["Analytics"],
    }),

    compareSubjects: builder.query({
      query: (args: {
        chapterA: string;
        chapterB: string;
        userId?: string;
      }) => {
        const params = new URLSearchParams();
        params.append("chapterA", args.chapterA);
        params.append("chapterB", args.chapterB);
        if (args.userId) params.append("userId", args.userId);
        return {
          url: `/analytics/subject-compare?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: TResponseRedux<SubjectCompareResult>) =>
        response.data,
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useMarkContentProgressMutation,
  useGetContentProgressQuery,
  useGetCourseCompletedContentIdsQuery,
  useGetMyPerformanceQuery,
  useGetMyCoursePerformanceQuery,
  useGetStudentPerformanceQuery,
  useGetStudentCoursePerformanceQuery,
  useGetCourseLeaderboardQuery,
  useCompareStudentsQuery,
  useLazyCompareStudentsQuery,
  useCompareSubjectsQuery,
  useLazyCompareSubjectsQuery,
} = analyticsApi;
