/* eslint-disable @typescript-eslint/no-explicit-any */
import { CourseContents, Quiz, TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "./baseApi";

const courseContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createVideoCourseContent: builder.mutation({
      query: (formData: FormData) => ({
        url: `/course-contents/video`,
        method: "POST",
        body: formData,
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
    updateVideoMutation: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/course-contents/video/${id}`,
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
        url: `/course-contents/question/answers`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: TResponseRedux<Quiz[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),
    updateContentStatus: builder.mutation({
      query: (data: { answerId: string; isCorrect: boolean }) => ({
        url: `/course-contents/question/answers`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["CourseContents"],
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
  useCreateVideoCourseContentMutation,
  useUpdateCourseContentMutation,
  useGetContentByIdQuery,
  useDeleteCourseContentByIdMutation,
  useGetAllContentsQuery,
  useDeleteSingleQuizMutation,
  useCreateQuizContentMutation,
  useGetAllQuizzesForCourseQuery,
  useUpdateVideoMutationMutation,
  useUpdateSingleQuizMutation,
  useAddSingleQuizMutation,
  useGetAllContentForSpecificCourseQuery,
  useGetQuestionsSubmitsForCurrentInstructorQuery,
  useUpdateContentStatusMutation,
} = courseContentApi;
