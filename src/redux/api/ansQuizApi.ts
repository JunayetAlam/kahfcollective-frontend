/* eslint-disable @typescript-eslint/no-explicit-any */
import { QuizAnswers, TResponseRedux } from "@/types";
import { baseApi } from "./baseApi";

export const quizAnswerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Answer a quiz
    answerQuiz: builder.mutation({
      query: (data: { quizId: string; answer: string }) => ({
        url: `/answer-quizzes`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["QuizAnswer"],
    }),

    // Lock all quizzes for a content
    lockQuiz: builder.mutation({
      query: (contentId: string) => ({
        url: `/answer-quizzes/lock/${contentId}`,
        method: "POST",
      }),
      invalidatesTags: ["QuizAnswer"],
    }),

    // Get quiz result for a content
    getQuizResult: builder.query({
      query: (contentId) => ({
        url: `/answer-quizzes/result/${contentId}`,
        method: "GET"
      }),
      
      providesTags: ["QuizAnswer"],
    }),

    // Get a single quiz with user's answer
    getSingleQuizAnswer: builder.query({
      query: (quizId) =>({
        url:  `/answer-quizzes/${quizId}`,
        method: "GET"
      }),
      transformResponse: (response: TResponseRedux<QuizAnswers>) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["QuizAnswer"],
    }),
  }),
});

export const {
  useAnswerQuizMutation,
  useLockQuizMutation,
  useGetQuizResultQuery,
  useGetSingleQuizAnswerQuery,
} = quizAnswerApi;
