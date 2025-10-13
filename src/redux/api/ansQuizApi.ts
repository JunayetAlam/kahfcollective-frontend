import { QuizAnswerGroup, QuizAnswers, QuizAnswersData, TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "./baseApi";

export const quizAnswerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    answerQuiz: builder.mutation({
      query: (data: { quizId: string; answer: string }) => ({
        url: `/answer-quizzes`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["QuizAnswer"],
    }),

    markQuizAnswer: builder.mutation({
      query: (data: { quizAnswerId: string; isRight: boolean }) => ({
        url: `/answer-quizzes/mark`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["QuizAnswer"],
    }),

    getAllQuizAnswers: builder.query({
      query: (args: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `/answer-quizzes/quiz-answers`,
          method: "GET",
          params: params
        }
      },
      transformResponse: (response: TResponseRedux<QuizAnswerGroup[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["QuizAnswer"],
    }),

    lockQuiz: builder.mutation({
      query: (contentId: string) => ({
        url: `/answer-quizzes/lock/${contentId}`,
        method: "POST",
      }),
      invalidatesTags: ["QuizAnswer"],
    }),

    getQuizResult: builder.query({
      query: (contentId: string) => ({
        url: `/answer-quizzes/result/${contentId}`,
        method: "GET",
      }),
      providesTags: ["QuizAnswer"],
    }),

    getInstructorResults: builder.query({
      query: (args: [{ name: 'contentId', value: string }, { name: 'userId', value: string }]) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `/answer-quizzes/result-instructor`,
          method: "GET",
          params: params,
        }
      },
      transformResponse: (response: TResponseRedux<QuizAnswersData>) => ({
        data: response.data,
      }),
      providesTags: ["QuizAnswer"],
    }),

    getSingleQuizAnswer: builder.query({
      query: (quizId: string) => ({
        url: `/answer-quizzes/${quizId}`,
        method: "GET",
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
  useMarkQuizAnswerMutation,
  useGetAllQuizAnswersQuery,
  useLockQuizMutation,
  useGetQuizResultQuery,
  useGetInstructorResultsQuery,
  useGetSingleQuizAnswerQuery,
} = quizAnswerApi;
