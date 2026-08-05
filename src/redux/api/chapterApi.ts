import { Chapter } from "@/types";
import { baseApi } from "./baseApi";

const chapterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createChapter: builder.mutation({
      query: (body: { semesterId: string; name: string }) => ({
        url: `/chapters`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Courses"],
    }),
    updateChapter: builder.mutation({
      query: ({ id, name }: { id: string; name: string }) => ({
        url: `/chapters/${id}`,
        method: "PATCH",
        body: { name },
      }),
      invalidatesTags: ["Courses"],
    }),
    changeChapterIndex: builder.mutation({
      query: ({ id, newIndex }: { id: string; newIndex: number }) => ({
        url: `/chapters/${id}/change-index`,
        method: "PATCH",
        body: { newIndex },
      }),
      invalidatesTags: ["Courses"],
    }),
    moveChapter: builder.mutation({
      query: ({
        id,
        semesterId,
        newIndex,
      }: {
        id: string;
        semesterId: string;
        newIndex: number;
      }) => ({
        url: `/chapters/${id}/move`,
        method: "PATCH",
        body: { semesterId, newIndex },
      }),
      invalidatesTags: ["Courses"],
    }),
    toggleDeleteChapter: builder.mutation({
      query: (id: string) => ({
        url: `/chapters/${id}/toggle-delete`,
        method: "PATCH",
      }),
      invalidatesTags: ["Courses"],
    }),
    getChaptersBySemester: builder.query({
      query: (semesterId: string) => ({
        url: `/chapters/semester/${semesterId}`,
        method: "GET",
      }),
      transformResponse: (response) =>
        (response as { data: Chapter[] }).data,
      providesTags: ["Courses"],
    }),
  }),
});

export const {
  useCreateChapterMutation,
  useUpdateChapterMutation,
  useChangeChapterIndexMutation,
  useMoveChapterMutation,
  useToggleDeleteChapterMutation,
  useGetChaptersBySemesterQuery,
} = chapterApi;
