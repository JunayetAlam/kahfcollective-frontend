import { baseApi } from "./baseApi";

const questionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createQuestion: builder.mutation({
      query: (data) => ({
        url: `/course-contents/question`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Questions", "CourseContents", "Courses"],
    }),
    createQuestionAnswer: builder.mutation({
      query: (data) => ({
        url: `/course-contents/question/answer`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Questions", "CourseContents", "Courses"],
    }),
  }),
});

export const { useCreateQuestionMutation, useCreateQuestionAnswerMutation } = questionApi;
