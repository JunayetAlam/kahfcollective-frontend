/* eslint-disable @typescript-eslint/no-explicit-any */
import { CourseContents, Quiz, TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "./baseApi";

const courseContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createFileContent: builder.mutation({
      query: (formData: FormData) => ({
        url: `/course-contents`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["CourseContents", "Courses"],
    }),
    createTextOrLinkContent: builder.mutation({
      query: (body) => ({
        url: `/course-contents/text-or-link`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CourseContents", "Courses"],
    }),
    createQuizContent: builder.mutation({
      query: (formData: FormData) => ({
        url: `/course-contents/quiz`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["CourseContents", "Courses"],
    }),
    updateCourseContent: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/course-contents/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CourseContents", "Courses"],
    }),
    getContentById: builder.query({
      query: (id: string) => ({
        url: `/course-contents/${id}`,
        method: "GET",
      }),
      providesTags: ["CourseContents"],
    }),
    deleteCourseContentById: builder.mutation({
      query: (id: string) => ({
        url: `/course-contents/${id}/toggle-delete`,
        method: "PATCH",
      }),
      invalidatesTags: ["CourseContents", "Courses"],
    }),
    updateFileContent: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/course-contents/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["CourseContents", "Courses"],
    }),
    getAllContents: builder.query({
      query: (args: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args)
          args.forEach((item) =>
            params.append(item.name, item.value as string),
          );
        return { url: "/course-contents", method: "GET", params };
      },
      transformResponse: (response: TResponseRedux<[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["CourseContents"],
    }),
    getAllContentForSpecificCourse: builder.query({
      query: (id) => {
        return { url: `/course-contents/course/${id}/user`, method: "GET" };
      },
      transformResponse: (response: TResponseRedux<CourseContents[]>) => ({
        data: response.data,
      }),
      providesTags: ["CourseContents"],
    }),

    deleteSingleQuiz: builder.mutation({
      query: (id: string) => ({
        url: `/course-contents/quiz/${id}/toggle-delete`,
        method: "PATCH",
      }),
      invalidatesTags: ["CourseContents", "Courses"],
    }),

    getAllQuizzesForCourse: builder.query({
      query: (id: string) => ({
        url: `/course-contents/${id}/quizzes/user`,
      }),
      transformResponse: (response: TResponseRedux<Quiz[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),
    getAllQuizzesForCourseAdmin: builder.query({
      query: (id: string) => ({
        url: `/course-contents/${id}/quizzes`,
      }),
      transformResponse: (response: TResponseRedux<Quiz[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),
    updateSingleQuiz: builder.mutation({
      query: ({ id, data }) => ({
        url: `/course-contents/quiz/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: TResponseRedux<Quiz[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),
    addSingleQuiz: builder.mutation({
      query: (data) => ({
        url: `/course-contents/quiz/single`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CourseContents", "Courses"],
    }),
    updateContentStatus: builder.mutation({
      query: (data: { answerId: string; isCorrect: boolean }) => ({
        url: `/course-contents/question/answers`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["CourseContents"],
    }),
    changeContentIndex: builder.mutation({
      query: ({ id, newIndex }: { id: string; newIndex: number }) => ({
        url: `/course-contents/${id}/change-index`,
        method: "PATCH",
        body: { newIndex },
      }),
      invalidatesTags: ["CourseContents", "Courses"],
    }),
    moveContent: builder.mutation({
      query: ({
        id,
        scope,
        semesterId,
        chapterId,
        newIndex,
      }: {
        id: string;
        scope: "COURSE" | "SEMESTER" | "CHAPTER";
        semesterId?: string | null;
        chapterId?: string | null;
        newIndex: number;
      }) => ({
        url: `/course-contents/${id}/move`,
        method: "PATCH",
        body: { scope, semesterId, chapterId, newIndex },
      }),
      invalidatesTags: ["CourseContents", "Courses"],
    }),
    getQuestionsSubmitsForCurrentInstructor: builder.query({
      query: (args: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args)
          args.forEach((item) =>
            params.append(item.name, item.value as string),
          );
        return {
          url: `/course-contents/question/answers`,

          method: "GET",
          params,
        };
      },
      transformResponse: (response: TResponseRedux<[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["CourseContents"],
    }),
  }),
});

export const {
  useCreateFileContentMutation,
  useCreateTextOrLinkContentMutation,
  useUpdateCourseContentMutation,
  useGetContentByIdQuery,
  useDeleteCourseContentByIdMutation,
  useGetAllContentsQuery,
  useDeleteSingleQuizMutation,
  useCreateQuizContentMutation,
  useGetAllQuizzesForCourseQuery,
  useUpdateFileContentMutation,
  useUpdateSingleQuizMutation,
  useAddSingleQuizMutation,
  useGetAllContentForSpecificCourseQuery,
  useGetQuestionsSubmitsForCurrentInstructorQuery,
  useUpdateContentStatusMutation,
  useGetAllQuizzesForCourseAdminQuery,
  useChangeContentIndexMutation,
  useMoveContentMutation,
} = courseContentApi;
